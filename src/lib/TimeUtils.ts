export function playerLastSeen(lastSeen: Date): string {
  let lastSeenText = "never";

  if (lastSeen) {
    const now: Date = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      lastSeenText = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      lastSeenText = `${diffHours} hour${
        diffHours > 1 ? "s" : ""
      } and ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      lastSeenText = `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      lastSeenText = "Left less thena a minute ago...";
    }
  }

  return lastSeenText;
}
