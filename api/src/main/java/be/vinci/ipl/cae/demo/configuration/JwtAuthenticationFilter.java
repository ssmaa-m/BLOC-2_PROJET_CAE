package be.vinci.ipl.cae.demo.configuration;

import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.services.MemberService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JwtAuthenticationFilter to handle member authentication.
 */
@Configuration
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final MemberService memberService;

  /**
   * Constructor for JwtAuthenticationFilter.
   *
   * @param memberService the injected MemberService
   */
  public JwtAuthenticationFilter(MemberService memberService) {
    this.memberService = memberService;
  }

  /**
   * Filter to handle JWT authentication.
   *
   * @param request the request
   * @param response the response
   * @param filterChain the filter chain
   */
  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String token = request.getHeader("Authorization");

    if (token != null) {

      String email = memberService.verifyJwtToken(token);

      if (email != null) {

        Member member = memberService.readOneFromEmail(email);

        if (member != null) {

          List<GrantedAuthority> authorities = new ArrayList<>();

          if (member.isAdmin()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
          }

          UsernamePasswordAuthenticationToken authentication =
              new UsernamePasswordAuthenticationToken(member, null, authorities);

          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }
    }

    filterChain.doFilter(request, response);
  }
}
