export interface LeadNotification {
  name: string;
  phone: string;
  propertyType: string;
  area: string;
  time: Date;
}

export type NotificationOutcome = 'sent' | 'failed' | 'not-configured';
export interface LeadNotifier {
  notify(lead: LeadNotification): Promise<NotificationOutcome>;
}
