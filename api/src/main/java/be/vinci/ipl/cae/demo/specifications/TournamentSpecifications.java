package be.vinci.ipl.cae.demo.specifications;

import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.lang.reflect.Member;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/**
 * Tournament specifications.
 */
public final class TournamentSpecifications {

  /**
   * Utility class constructor.
   */
  private TournamentSpecifications() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Specifies the status of the tournament.
   *
   * @param statuses the tournament statuses
   * @return the specification
   */
  public static Specification<Tournament> hasStatuses(List<TournamentStatus> statuses) {
    if (statuses == null || statuses.isEmpty()) {
      return null;
    }

    return (root, query, cb) -> {
      return root.get("status").in(statuses);
    };
  }

  /**
   * Specifies a search filter on the tournament name.
   *
   * @param keyword the search keyword
   * @return the specification
   */
  public static Specification<Tournament> searchByName(String keyword) {
    return CommonSpecifications.searchByAttribute("name", keyword);
  }

  /**
   * Specifies the teams of the tournament.
   *
   * @param teamIds the team IDs
   * @return the specification
   */
  public static Specification<Tournament> hasTeams(List<Long> teamIds) {
    if (teamIds == null || teamIds.isEmpty()) {
      return null;
    }

    return (root, query, cb) -> {
      query.distinct(true);

      Join<Tournament, Team> teamJoin = root.join("teams");
      return teamJoin.get("idTeam").in(teamIds);
    };
  }

  /**
   * Specifies the members in the matches of the tournament.
   *
   * @param memberIds the member IDs
   * @return the specification
   */
  public static Specification<Tournament> hasMembersInMatches(List<Long> memberIds) {
    if (memberIds == null || memberIds.isEmpty()) {
      return null;
    }

    return (root, query, cb) -> {
      query.distinct(true);

      Subquery<Long> subquery = query.subquery(Long.class);
      Root<MatchLineup> lineupRoot = subquery.from(MatchLineup.class);

      Join<MatchLineup, Member> memberJoin = lineupRoot.join("members");

      subquery
          .select(lineupRoot.get("match").get("tournament").get("idTournament"))
          .where(memberJoin.get("idMember").in(memberIds));

      return root.get("idTournament").in(subquery);
    };
  }

  /**
   * Specifies the date range filter for the tournament start date.
   *
   * @param minDate the minimum start date
   * @param maxDate the maximum start date
   * @return the specification
   */
  public static Specification<Tournament> isBetweenDates(LocalDate minDate, LocalDate maxDate) {
    if (minDate == null && maxDate == null) {
      return null;
    }

    return (root, query, cb) -> {
      if (minDate != null && maxDate != null) {
        return cb.between(root.get("startDate"), minDate, maxDate);
      }

      if (minDate != null) {
        return cb.greaterThanOrEqualTo(root.get("startDate"), minDate);
      }

      return cb.lessThanOrEqualTo(root.get("startDate"), maxDate);
    };
  }
}
