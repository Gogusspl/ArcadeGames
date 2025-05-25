package com.example;

import com.example.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        String response = authService.register(user);
        if (response.equals("User created successfully")) {
            return ResponseEntity.ok(new ApiResponse(response));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(response));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginRequest) {
        String result = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (result.equals("Login successful")) {
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            return ResponseEntity.ok("Bearer " + token);
        } else {
            return ResponseEntity.status(403).body("Invalid credentials");
        }
    }

    @GetMapping("/{username}/balance")
    public ResponseEntity<BigDecimal> getUserBalance(@PathVariable String username) {
        Optional<User> userOpt = authService.getUserByUsername(username);
        return userOpt.map(user -> ResponseEntity.ok(user.getBalance())).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{username}/balance")
    public ResponseEntity<ApiResponse> updateBalance(
            @PathVariable String username,
            @RequestBody BalanceUpdateRequest request
    ) {
        Optional<User> userOpt = authService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setBalance(user.getBalance().add(request.getAmount()));
            authService.saveUser(user);
            return ResponseEntity.ok(new ApiResponse("Balance updated successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
