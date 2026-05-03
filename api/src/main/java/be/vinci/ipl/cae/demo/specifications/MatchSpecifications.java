package be.vinci.ipl.cae.demo.specifications;

import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.Locale;
import java.util.function.Function;
import org.springframework.data.jpa.domain.Specification;

/**
 * Specifications for Match entities.
 */
public final class MatchSpecifications {

  /**
   * Utility class constructor.
   */
  private MatchSpecifications() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Specifies a filter on the match team id.
   *
   * @param teamId the team id to filter on
   * @return the specification
   */
  public static Specification<Match> hasTeam(Long teamId) {
    if (teamId == null) {
      return null;
    }

    return (root, query, cb) -> applyTeamCondition(
        root,
        cb,
        team -> cb.equal(team.get("idTeam"), teamId));
  }

  /**
   * Specifies a filter on the match member id.
   *
   * @param memberId the member id to filter on
   * @return the specification
   */
  public static Specification<Match> hasMember(Long memberId) {
    if (memberId == null) {
      return null;
    }

    return (root, query, cb) -> {
      Join<Match, MatchLineup> lineups = root.join("lineups", JoinType.LEFT);
      Join<MatchLineup, Member> playingMembers = lineups.join("members", JoinType.LEFT);

      query.distinct(true);

      return cb.equal(playingMembers.get("idMember"), memberId);
    };
  }

  /**
   * Specifies a search filter on the match team name.
   *
   * @param keyword the search keyword
   * @return the specification
   */
  public static Specification<Match> searchByTeamName(String keyword) {
    if (keyword == null || keyword.trim().isEmpty()) {
      return null;
    }

    String pattern = "%" + keyword.toLowerCase(Locale.ROOT) + "%";

    return (root, query, cb) -> applyTeamCondition(
        root,
        cb,
        team -> cb.like(cb.lower(team.get("name")), pattern));
  }

  /**
   * Applies a team condition to the match root.
   *
   * @param root the match root
   * @param cb the criteria builder
   * @param condition the team condition
   * @return the predicate
   */
  private static Predicate applyTeamCondition(
      Root<Match> root,
      CriteriaBuilder cb,
      Function<Join<Match, Team>, Predicate> condition) {
    Join<Match, Team> team1 = root.join("team1", JoinType.LEFT);
    Join<Match, Team> team2 = root.join("team2", JoinType.LEFT);

    return cb.or(condition.apply(team1), condition.apply(team2));
  }
}
