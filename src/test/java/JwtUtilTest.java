
import com.example.security.JwtUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Test
    void shouldGenerateAndValidateToken() {
        String token = jwtUtil.generateToken("john");

        assertNotNull(token);
        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals("john", jwtUtil.extractUsername(token));
    }

    @Test
    void shouldInvalidateTamperedToken() {
        String token = jwtUtil.generateToken("john");
        String tampered = token + "abc";

        assertFalse(jwtUtil.isTokenValid(tampered));
    }
}
