import { AsyncStorage } from 'react-native';
import { Notifications, Permissions } from 'expo';

// most of this came from the udacifitness app
export const DECKS_STORAGE_KEY = 'MobileFlashcards:decks';
export const NOTIFICATION_KEY = 'MobileFlashcards:notifications';

export function formatDecks(decks) {
  return JSON.parse(decks);
}

export function formatCards(cards) {
  return JSON.parse(cards);
}

export function clearLocalNotification() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
}

function createNotification() {
  return {
    title: 'Study Flashcards',
    body: "👋 Don't forget to study your flashcards today!",
    ios: {
      sound: true
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true
    }
  };
}

export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then(data => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          if (status === 'granted') {
            Notifications.cancelAllScheduledNotificationsAsync();

            let t = new Date();
            t.setDate(t.getDate() + 1);
            t.setHours(17);
            t.setMinutes(0);

            Notifications.scheduleLocalNotificationAsync(createNotification(), {
              time: t,
              repeat: 'day'
            });
            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
          }
        });
      }
    });
}
