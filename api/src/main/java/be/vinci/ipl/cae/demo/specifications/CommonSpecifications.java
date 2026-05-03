package be.vinci.ipl.cae.demo.specifications;

import java.util.Locale;
import org.springframework.data.jpa.domain.Specification;

/**
 * Common specifications for all entities.
 */
public final class CommonSpecifications {

  /**
   * Utility class constructor.
   */
  private CommonSpecifications() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Specifies a search filter on a string attribute.
   *
   * @param <T> the type of the entity
   * @param attribute the attribute name
   * @param keyword the search keyword
   * @return the specification
   */
  public static <T> Specification<T> searchByAttribute(String attribute, String keyword) {
    if (keyword == null || keyword.isBlank()) {
      return null;
    }

    String pattern = "%" + keyword.toLowerCase(Locale.ROOT) + "%";

    return (root, query, cb) -> {
      return cb.like(cb.lower(root.get(attribute)), pattern);
    };
  }
}
