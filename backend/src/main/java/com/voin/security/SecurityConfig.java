package com.voin.security;

import com.voin.security.JwtAuthenticationEntryPoint;
import com.voin.security.JwtAccessDeniedHandler;
import com.voin.security.JwtAuthenticationFilter;
import com.voin.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final Environment environment;

    // 허용할 CORS 출처(쉼표 구분). 로컬 기본값이며 운영은 APP_CORS_ALLOWED_ORIGINS 환경변수로 주입
    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins}")
    private String[] corsAllowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // H2 콘솔·Swagger 는 개발용 도구이므로 prod 프로필에서는 노출하지 않음(local/test 에서만 공개)
        boolean devTools = !environment.matchesProfiles("prod");

        http
                .csrf(csrf -> csrf.disable())
                .headers(h -> {
                    if (devTools) {
                        // H2 콘솔은 iframe 을 쓰므로 개발 프로필에서만 frameOptions 를 해제
                        h.frameOptions(frame -> frame.disable());
                    }
                    // prod: frameOptions 기본값(DENY) 유지
                })
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> {
                        // 1) 완전 공개(정적/에러/초기 진입)
                        auth.requestMatchers("/", "/index.html", "/favicon.ico", "/error").permitAll();
                        // 1-1) H2 콘솔·Swagger: 개발 프로필에서만 공개, prod 에서는 아래 인증 규칙에 걸려 차단됨
                        if (devTools) {
                            auth.requestMatchers("/h2-console/**", "/swagger-ui/**", "/swagger-ui.html",
                                    "/api-docs/**", "/v3/api-docs/**").permitAll();
                        }
                        auth
                                // 2) 카카오 로그인 흐름에 필요한 공개 경로
                                .requestMatchers("/auth/**", "/signup/**",
                                        "/api/auth/kakao/callback", // 콜백/URL/검증 등
                                        "/api/auth/kakao/verify", "/api/auth/kakao/url", "/api/auth/validate").permitAll()
                                // 3) 로그인 전 공용 데이터(키워드 등)
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/master/**").permitAll()
                                // 4) 웹소켓 핸드셰이크
                                .requestMatchers("/ws/**", "/ws").permitAll()
                                // 5) 그 외 API는 인증 필요
                                .requestMatchers("/api/**").authenticated()
                                // 6) 나머지 전부 인증
                                .anyRequest().authenticated();
                })
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(java.util.Arrays.asList(corsAllowedOrigins));
        config.setAllowedMethods(java.util.List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("Authorization","Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
