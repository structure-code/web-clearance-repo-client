import React from 'react';
import { useNotifications, useMarkNotificationAsRead } from '../hooks/useNotifications';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatDate } from '../utils/helpers';
import { Check, Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationAsRead();

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Notifications" description="Recent clearance updates and account alerts." />

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No notifications yet.
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const isRead = notification.isRead ?? notification.read ?? false;

            return (
              <Card key={notification.id} className={isRead ? 'bg-card' : 'border-primary/40 bg-primary/5'}>
                <CardContent className="p-4 flex items-start gap-4">
                  <Bell className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{notification.title || 'Notification'}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message || 'No message provided.'}</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.createdAt, 'PPp')}</p>
                      </div>
                      {!isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markRead.mutate(notification.id)}
                          disabled={markRead.isPending}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
