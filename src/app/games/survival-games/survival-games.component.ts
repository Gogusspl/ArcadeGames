import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Ball {
  id: number;
  color: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  isStar: boolean;
  active: boolean;
  transformTimeout?: any;
  betAmount?: number;
  lastWallBounce?: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
}

@Component({
  selector: 'app-survival-games',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './survival-games.component.html',
  styleUrls: ['./survival-games.component.css']
})
export class SurvivalGamesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  balls: Ball[] = [];
  nextBallId = 0;
  selectedBall: number | null = null;
  intervalId: any;
  starSpawnTimeout: any;
  randomStars: Star[] = [];
  maxStars = 5;

  canvasWidth = 600;
  canvasHeight = 600;

  points: number = 0;
  gameOverMessage: string | null = null;
  startDisabled = false;

  audio = new Audio('assets/jeremy.mp3');
  authService = inject(AuthService);

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.loadUserBalance();
    this.initializeBalls();

    this.canvasRef.nativeElement.addEventListener('click', () => {
      this.audio.load();
      this.audio.play().then(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
      }).catch(e => console.warn('Audio init failed:', e));
    }, { once: true });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearTimeout(this.starSpawnTimeout);
    this.audio.pause();
  }

  loadUserBalance() {
    const username = localStorage.getItem('username');
    if (username) {
      this.authService.getBalance(username).subscribe({
        next: (data) => this.points = data,
        error: (err) => console.error('Błąd przy pobieraniu salda:', err)
      });
    }
  }

  initializeBalls() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    for (let i = 0; i < colors.length; i++) {
      this.balls.push({
        id: this.nextBallId++,
        color: colors[i],
        x: Math.random() * 500 + 50,
        y: Math.random() * 500 + 50,
        dx: (Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1),
        dy: (Math.random() * 3 + 1) * (Math.random() < 0.5 ? 1 : -1),
        radius: 15,
        isStar: false,
        active: true,
        betAmount: 0
      });
    }
  }

  selectBall(id: number) {
    this.selectedBall = id;
    this.balls.forEach(ball => {
      if (ball.id !== id) {
        ball.betAmount = 0;
      }
    });
  }

  canStartGame(): boolean {
    return (
      !this.startDisabled &&
      this.balls.filter(b => b.betAmount && b.betAmount > 0).length === 1
    );
  }

  startGame() {
    if (!this.canStartGame()) return;

    const totalBet = this.balls.reduce((sum, b) => sum + (b.betAmount || 0), 0);
    if (totalBet > this.points) {
      alert('Nie masz wystarczającego salda na te zakłady!');
      return;
    }

    this.points -= totalBet;
    this.startDisabled = true;

    const username = localStorage.getItem('username');
    if (username) {
      this.authService.updateBalance(username, -totalBet).subscribe({
        next: () => this._startGameLoop(),
        error: (err) => {
          console.error('Błąd przy aktualizacji salda:', err);
          alert('Błąd podczas aktualizacji salda.');
        }
      });
    } else {
      this._startGameLoop();
    }
  }

  private _startGameLoop() {
    clearInterval(this.intervalId);
    clearTimeout(this.starSpawnTimeout);
    this.randomStars = [];

    this.intervalId = setInterval(() => {
      this.update();
      this.draw();
    }, 20);

    this.scheduleRandomStar();

    this.audio.currentTime = 0;
    this.audio.loop = true;
    this.audio.play().catch(e => console.warn('Audio play failed:', e));
  }

  update() {
    const now = Date.now();

    for (const ball of this.balls) {
      if (!ball.active) continue;

      const nextX = ball.x + ball.dx;
      const nextY = ball.y + ball.dy;

      if (nextX - ball.radius < 0 || nextX + ball.radius > this.canvasWidth) {
        ball.dx = -ball.dx || (Math.random() - 0.5) * 4;
        ball.x = Math.min(Math.max(ball.x, ball.radius), this.canvasWidth - ball.radius);
        ball.lastWallBounce = now;
      }

      if (nextY - ball.radius < 0 || nextY + ball.radius > this.canvasHeight) {
        ball.dy = -ball.dy || (Math.random() - 0.5) * 4;
        ball.y = Math.min(Math.max(ball.y, ball.radius), this.canvasHeight - ball.radius);
        ball.lastWallBounce = now;
      }

      if (Math.abs(ball.dx) < 0.1) ball.dx = (Math.random() - 0.5) * 4;
      if (Math.abs(ball.dy) < 0.1) ball.dy = (Math.random() - 0.5) * 4;

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.lastWallBounce && now - ball.lastWallBounce > 300) {
        ball.radius = Math.min(ball.radius + 1, 80);
        ball.lastWallBounce = 0;
      }

      for (const star of this.randomStars) {
        const dist = Math.hypot(ball.x - star.x, ball.y - star.y);
        if (dist < ball.radius + star.size / 2) {
          const previous = this.balls.find(b => b.isStar && b.id !== ball.id);
          if (previous) {
            previous.isStar = false;
            clearTimeout(previous.transformTimeout);
          }

          ball.isStar = true;
          ball.transformTimeout = setTimeout(() => {
            ball.isStar = false;
          }, 5000);

          this.randomStars = this.randomStars.filter(s => s.id !== star.id);
          break;
        }
      }
    }

    const stars = this.balls.filter(b => b.isStar && b.active);
    for (const s of stars) {
      for (const o of this.balls) {
        if (!o.active || o.id === s.id || o.isStar) continue;
        const dist = Math.hypot(s.x - o.x, s.y - o.y);
        if (dist < s.radius + o.radius) {
          o.active = false;
          s.isStar = false;
          clearTimeout(s.transformTimeout);
        }
      }
    }

    for (let i = 0; i < this.balls.length; i++) {
      const b1 = this.balls[i];
      if (!b1.active) continue;
      for (let j = i + 1; j < this.balls.length; j++) {
        const b2 = this.balls[j];
        if (!b2.active) continue;
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.hypot(dx, dy);
        if (dist < b1.radius + b2.radius) {
          const angle = Math.atan2(dy, dx);
          const speed1 = Math.hypot(b1.dx, b1.dy);
          const speed2 = Math.hypot(b2.dx, b2.dy);

          b1.dx = -Math.cos(angle) * speed2;
          b1.dy = -Math.sin(angle) * speed2;
          b2.dx = Math.cos(angle) * speed1;
          b2.dy = Math.sin(angle) * speed1;
        }
      }
    }

    const remaining = this.balls.filter(b => b.active);
    if (remaining.length === 1) {
      this.endGame(!!remaining[0].betAmount && remaining[0].betAmount > 0);
    }
  }

  endGame(won: boolean) {
    this.gameOverMessage = won ? 'Wygrałeś!' : 'Przegrałeś!';
    clearInterval(this.intervalId);
    clearTimeout(this.starSpawnTimeout);
    this.audio.pause();

    if (won) {
      const totalBet = this.balls.reduce((sum, b) => sum + (b.betAmount || 0), 0);
      const winAmount = totalBet * 4;
      this.points += winAmount;

      const username = localStorage.getItem('username');
      if (username) {
        this.authService.updateBalance(username, winAmount).subscribe({
          error: err => console.error('Błąd przy aktualizacji salda po wygranej:', err)
        });
      }
    }

    setTimeout(() => {
      this.resetGame();
      this.startDisabled = false;
    }, 5000);
  }

  resetGame() {
    this.balls = [];
    this.randomStars = [];
    this.nextBallId = 0;
    this.selectedBall = null;
    this.gameOverMessage = null;
    this.initializeBalls();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (const ball of this.balls) {
      if (!ball.active) continue;
      this.ctx.fillStyle = ball.color;

      if (ball.isStar) {
        this.drawStar(ball.x, ball.y, 5, ball.radius, ball.radius / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      if (ball.betAmount && ball.betAmount > 0) {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`${ball.betAmount} pkt`, ball.x - ball.radius, ball.y - ball.radius - 5);
      }
    }

    for (const star of this.randomStars) {
      this.ctx.fillStyle = 'gold';
      this.drawStar(star.x, star.y, 5, star.size / 2, star.size / 4);
    }

    if (this.gameOverMessage) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '30px Arial';
      this.ctx.fillText(this.gameOverMessage, this.canvasWidth / 2 - 80, this.canvasHeight / 2);
    }
  }

  drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  scheduleRandomStar() {
    const delay = Math.random() * 3000 + 2000;
    this.starSpawnTimeout = setTimeout(() => {
      if (this.randomStars.length < this.maxStars) {
        const size = 30;
        const x = Math.random() * (this.canvasWidth - size) + size / 2;
        const y = Math.random() * (this.canvasHeight - size) + size / 2;
        const id = Date.now() + Math.floor(Math.random() * 10000);
        this.randomStars.push({ id, x, y, size });
      }
      this.scheduleRandomStar();
    }, delay);
  }
}
