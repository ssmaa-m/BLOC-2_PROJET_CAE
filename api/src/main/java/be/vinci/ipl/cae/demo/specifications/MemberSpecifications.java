package be.vinci.ipl.cae.demo.specifications;

import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.services.MemberService.MemberQueryStatus;
import org.springframework.data.jpa.domain.Specification;

/**
 * Member specifications.
 */
public final class MemberSpecifications {

  /**
   * Utility class constructor.
   */
  private MemberSpecifications() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Specifies a filter on the member query status.
   *
   * @param state the member query status
   * @return the specification
   */
  public static Specification<Member> hasState(MemberQueryStatus state) {
    if (state == null) {
      return null;
    }

    return (root, query, criteriaBuilder) -> {
      switch (state) {
        case MemberQueryStatus.ADMIN:
          return criteriaBuilder
              .and(
                  criteriaBuilder.isTrue(root.get("isAdmin")),
                  criteriaBuilder.isFalse(root.get("isDeleted")));
        case MemberQueryStatus.MEMBER:
          return criteriaBuilder
              .and(
                  criteriaBuilder.isFalse(root.get("isAdmin")),
                  criteriaBuilder.isFalse(root.get("isDeleted")));
        case MemberQueryStatus.BANNED:
          return criteriaBuilder.and(criteriaBuilder.isTrue(root.get("isDeleted")));
        default:
          return null;
      }
    };
  }

  /**
   * Specifies a search filter on the member tag and email.
   *
   * @param keyword the search keyword
   * @return the specification
   */
  public static Specification<Member> search(String keyword) {
    return CommonSpecifications.searchByAttribute("tag", keyword);
  }
}
