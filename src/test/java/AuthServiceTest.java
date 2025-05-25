
import com.example.AuthService;
import com.example.User;
import com.example.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void register_shouldReturnSuccess_whenUsernameIsUnique() {
        User user = new User();
        user.setUsername("john");
        user.setPassword("plainPassword");

        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");

        String result = authService.register(user);

        assertEquals("User created successfully", result);
        verify(userRepository).save(argThat(savedUser ->
                savedUser.getUsername().equals("john") &&
                        savedUser.getPassword().equals("hashedPassword")
        ));
    }

    @Test
    void register_shouldReturnError_whenUsernameExists() {
        User existingUser = new User();
        existingUser.setUsername("john");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(existingUser));

        User newUser = new User();
        newUser.setUsername("john");
        newUser.setPassword("pass");

        String result = authService.register(newUser);

        assertEquals("Username already exists", result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnSuccess_whenCredentialsAreValid() {
        User user = new User();
        user.setUsername("john");
        user.setPassword("hashedPassword");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plainPassword", "hashedPassword")).thenReturn(true);

        String result = authService.login("john", "plainPassword");

        assertEquals("Login successful", result);
    }

    @Test
    void login_shouldReturnError_whenCredentialsAreInvalid() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());

        String result = authService.login("john", "somePassword");

        assertEquals("Invalid credentials", result);
    }

    @Test
    void login_shouldReturnError_whenPasswordDoesNotMatch() {
        User user = new User();
        user.setUsername("john");
        user.setPassword("hashedPassword");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        String result = authService.login("john", "wrongPassword");

        assertEquals("Invalid credentials", result);
    }
}
