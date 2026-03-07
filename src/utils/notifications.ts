export const notifyInterviewComplete = (score: number) => {
  console.log(`Interview complete with score: ${score}%`);
  // In a real app, this could trigger a browser notification
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('Interview Analysis Complete', {
        body: `You scored ${score}% in your recent session. View your detailed feedback now!`,
      });
    }
  }
};
