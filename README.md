Arcadia Casino 🎰

Arcadia Casino to aplikacja webowa z grami losowymi online, stworzona z myślą o oferowaniu użytkownikom prostych, 
lecz wciągających gier w środowisku przeglądarkowym. Projekt ten został zaprojektowany i zbudowany w oparciu o nowoczesny stack technologiczny, łączący w sobie solidne fundamenty backendowe i dynamiczny interfejs frontendowy.

🔧 Technologia:

Aplikacja została zaprojektowana jako aplikacja webowa typu full-stack. W warstwie frontendowej wykorzystano Angular, wraz z HTML, CSS i TypeScript, co pozwoliło na stworzenie responsywnego i interaktywnego 
interfejsu użytkownika. Z kolei backend został zaimplementowany w języku Java przy użyciu Spring Boot, który zapewnia solidną strukturę REST API i umożliwia łatwe zarządzanie logiką biznesową oraz integracją z bazą danych.

Projekt wykorzystuje również:

Hibernate jako ORM do komunikacji z bazą danych

PostgreSQL jako główny system bazodanowy

Maven do zarządzania zależnościami

Git do kontroli wersji i współpracy zespołowej


🔐 Logowanie

Po wejściu na stronę użytkownik jest automatycznie kierowany do ekranu logowania. Interfejs logowania pozwala na podanie loginu i hasła, w przypadku błędnych danych uwierzytelniających,
użytkownik otrzymuje jasny komunikat informujący o błędzie, co pozwala na szybką korektę. Tylko poprawne dane umożliwiają przejście dalej. Po udanym logowaniu użytkownik zostaje przekierowany na stronę główną serwisu.

![Zrzut ekranu 2025-05-27 095553](https://github.com/user-attachments/assets/598728f3-938b-4fd5-a5c7-cac5bbbd985e)

🏠 Strona Główna 

Strona główna aplikacji Arcadia Casino została zaprojektowana w sposób czytelny i intuicyjny.
W lewym górnym rogu znajduje się logo serwisu. Po przeciwnej stronie, w prawym górnym rogu, 
prezentowane jest aktualne saldo konta użytkownika. Obok znajduje się przycisk umożliwiający dodanie środków – ta funkcjonalność jest istotna, ponieważ większość aktywności w serwisie wymaga posiadania dodatniego salda.

Pod głównym nagłówkiem witryny umieszczony jest blok reklamowy w formie grafiki oraz wyróżniona nazwa strony, co nadaje stronie charakterystyczny i spójny wygląd.
Bezpośrednio pod tym obszarem wyświetlana jest lista dostępnych gier, które użytkownik może uruchomić.

![Zrzut ekranu 2025-05-27 095636](https://github.com/user-attachments/assets/a2eaffb1-c25b-42eb-aecf-04ccae2c999d)

🎮 Gry

Obecnie dostępna jest jedna gra "Pixel Survival", która stanowi pierwszy krok w kierunku rozbudowy oferty gier na platformie.

🌈 Pixel Survival – Opis Gry

Pixel Survival to gra oparta na prostych zasadach fizyki i losowości, która dostarcza emocjonującej rozgrywki. Po uruchomieniu gry użytkownik widzi główny ekran gry umieszczony centralnie na stronie. W prawym górnym rogu nadal widnieje saldo użytkownika, co pozwala kontrolować dostępne środki podczas rozgrywki.

Poniżej ekranu gry znajdują się opcje obstawiania. Użytkownik wybiera jeden z dostępnych kolorów, który reprezentuje kulkę biorącą udział w grze. Następnie w specjalnym polu należy wpisać ilość punktów, jaką chce się postawić na wybraną kulkę, i nacisnąć przycisk "Start", aby rozpocząć grę. System automatycznie sprawdza, czy saldo użytkownika jest większe od zera – w przeciwnym wypadku gra nie zostanie uruchomiona.
![Zrzut ekranu 2025-05-27 100210](https://github.com/user-attachments/assets/6716b0fe-8c9c-452b-8f3d-daadbb306a05)

⚙️ Mechanika Rozgrywki

Po rozpoczęciu gry, na ekranie pojawiają się kolorowe kulki, które zaczynają się poruszać i odbijać od ścian oraz od siebie nawzajem. Każde odbicie kulki od ściany powoduje, że kulka zwiększa swój rozmiar. Dodatkowo, na mapie co pewien czas losowo pojawiają się gwiazdki (specjalne power-upy). Jeżeli kulka na nie natrafi, zostaje ona ulepszona do postaci "gwiezdnej kulki", która zyskuje moc eliminowania innych kulek poprzez kontakt.
W danym momencie tylko jedna kulka może być gwiezdna, co wprowadza element strategii i losowości do rozgrywki. Gra trwa aż do momentu, gdy na planszy pozostanie tylko jedna kulka – jeśli jest to kulka, na którą użytkownik postawił swoje środki, gra zostaje wygrana, a użytkownik otrzymuje punkty.
W przypadku przegranej, obstawione środki zostają odjęte od konta gracza.
![Zrzut ekranu 2025-05-27 100706](https://github.com/user-attachments/assets/28702256-8a52-4cae-a489-f4662fb7a844)

Plany Rozwoju
W kolejnych etapach planowane jest:

Dodanie większej liczby gier

Wprowadzenie systemu rankingowego

Rozbudowanie panelu użytkownika

System nagród, osiągnięć i turniejów
