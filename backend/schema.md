# DayTrack Database Schema

Database: `daytrack`

The system uses four collections:

- `users`
- `tasks`
- `archived_tasks`
- `daily_summaries`

---

# 1. users

Stores user information.

| Field | Type | Description |
|------|------|-------------|
| `_id` | ObjectId | Unique user identifier |
| `name` | String | User's name |
| `email` | String | Unique user email |
| `created_at` | Date | User creation timestamp |

Index:
- `email` (unique)

---

# 2. tasks

Stores active tasks for the current day.

| Field | Type | Description |
|------|------|-------------|
| `_id` | ObjectId | Unique task identifier |
| `user_id` | ObjectId | Reference to user |
| `title` | String | Task title (required) |
| `description` | String | Optional task description |
| `status` | String | Task status (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `NOT_COMPLETED`) |
| `created_at` | Date | Task creation timestamp |
| `updated_at` | Date | Last update timestamp |
| `completed_at` | Date / null | Completion timestamp |

Indexes:
- `user_id`
- `created_at`
- `status`

---

# 3. archived_tasks

Stores tasks moved from the active collection after End-of-Day processing.

| Field | Type | Description |
|------|------|-------------|
| `_id` | ObjectId | Unique task identifier |
| `user_id` | ObjectId | Reference to user |
| `title` | String | Task title |
| `description` | String | Task description |
| `status` | String | Final task status (`COMPLETED` or `NOT_COMPLETED`) |
| `created_at` | Date | Original creation timestamp |
| `completed_at` | Date / null | Completion timestamp |
| `archive_date` | String | Date the task belongs to (YYYY-MM-DD) |
| `archived_at` | Date | Timestamp when archived |

Indexes:
- `user_id`
- `archive_date`

---

# 4. daily_summaries

Stores End-of-Day summary statistics for each user.

| Field | Type | Description |
|------|------|-------------|
| `_id` | ObjectId | Unique summary identifier |
| `user_id` | ObjectId | Reference to user |
| `date` | String | Summary date (YYYY-MM-DD) |
| `tasks_created` | Number | Total tasks created that day |
| `tasks_completed` | Number | Total tasks completed |
| `tasks_pending` | Number | Total tasks pending at end of day |
| `completion_percentage` | Number | Completion percentage |
| `generated_at` | Date | Time when summary was generated |

Indexes:
- `user_id`
- `date`
- `(user_id, date)` unique