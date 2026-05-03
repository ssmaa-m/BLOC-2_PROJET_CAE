package be.vinci.ipl.cae.demo.specifications;

import be.vinci.ipl.cae.demo.models.entities.Team;
import org.springframework.data.jpa.domain.Specification;

/**
 * Team specifications.
 */
public final class TeamSpecifications {

  /**
   * Utility class constructor.
   */
  private TeamSpecifications() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Specifies a search filter on the team active status.
   *
   * @param isActive the active status
   * @return the specification
   */
  public static Specification<Team> isActive(boolean isActive) {
    if (!isActive) {
      return null;
    }

    return (root, query, cb) -> {
      return cb.equal(root.get("isActive"), isActive);
    };
  }

  /**
   * Specifies a search filter on the team name.
   *
   * @param keyword the search keyword
   * @return the specification
   */
  public static Specification<Team> searchByName(String keyword) {
    return CommonSpecifications.searchByAttribute("name", keyword);
  }
}
