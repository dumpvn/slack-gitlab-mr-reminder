const SlackGitlabMRReminder = require('./slack-gitlab-mr-reminder');

const mock_options = {
  slack: {
    webhook_url: 'hook',
    channel: 'merge-requests',
  },
  gitlab: {
    access_token: 'token',
    group: 'mygroup'
  }
};

const mock_merge_requests = [
  {
    id: 1,
    title: 'MR1',
    description: 'MR1 description',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/1',
    updated_at: 1234567
  },
  {
    id: 2,
    title: 'MR2',
    description: 'MR2 description',
    author: {
      name: 'person'
    },
    web_url: 'https://gitlab.com/merge/2',
    updated_at: 1234567
  }
]

test('merge requests reminder is sent', async () => {
  var reminder = new SlackGitlabMRReminder(mock_options);
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve(mock_merge_requests);
      });
    });
  });
  const result = await reminder.remind();
  expect(result).toBe('Reminder sent');
  expect(reminder.webhook.send).toHaveBeenCalled();
});

test('no merge requests to send', async () => {
  var reminder = new SlackGitlabMRReminder(mock_options);
  reminder.gitlab.getGroupMergeRequests = jest.fn(() => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        resolve([]);
      });
    });
  });
  
  expect(await reminder.remind()).toEqual('No reminders to send');
});
