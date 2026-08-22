export const canViewUserContent = (
  owner,
  viewer
) => {
  if (!owner?.email) {
    return false;
  }

  if (
    viewer?.email &&
    owner.email === viewer.email
  ) {
    return true;
  }

  if (
    owner?.isPrivate !== true
  ) {
    return true;
  }

  const followers =
    Array.isArray(
      owner.followers
    )
      ? owner.followers
      : [];

  return Boolean(
    viewer?.email &&
    followers.includes(
      viewer.email
    )
  );
};
