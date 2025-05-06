type Contact = {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  subscribed?: boolean;
  userGroup?: string;
  userId?: string;
  mailingLists?: Record<string, boolean>;

  // Custom properties
  schoolName: string;
};

export type { Contact };
