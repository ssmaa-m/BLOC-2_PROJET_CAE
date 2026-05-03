package be.vinci.ipl.cae.demo.repositories;

import be.vinci.ipl.cae.demo.models.entities.Notification;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

/**
 * Repository interface for Notification entities. Provides specialized query methods for
 * member-specific notification management.
 */
public interface NotificationRepository extends CrudRepository<Notification, Long> {

  /**
   * Retrieves all notifications for a specific member, prioritized by read status. Unread
   * notifications (isRead=false) appear first, followed by read notifications. Results are further
   * sorted by the creation date in descending order.
   *
   * @param idMember the unique identifier of the member.
   * @return an iterable of notifications sorted by read status and date.
   */
  Iterable<Notification> findByMemberIdMemberOrderByIsReadAscDateTimeDesc(Long idMember);

  /**
   * Retrieves only the notifications that have not been read yet for a specific member.
   *
   * @param idMember the unique identifier of the member.
   * @return an iterable containing only unread notifications.
   */
  Iterable<Notification> findByMemberIdMemberAndIsReadFalseOrderByDateTimeDesc(Long idMember);

  /**
   * Calculates the total count of unread notifications for a specific member. This is used to
   * display the numerical badge on the notification bell.
   *
   * @param idMember the unique identifier of the member.
   * @return the total number of unread notifications.
   */
  long countByMemberIdMemberAndIsReadFalse(Long idMember);

  /**
   * Get a notification by its id.
   *
   * @param idNotification id of the notification
   * @return an optional notification
   */
  Optional<Notification> getNotificationByIdNotification(Long idNotification);
}
