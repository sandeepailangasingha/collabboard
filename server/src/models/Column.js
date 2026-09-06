import mongoose from 'mongoose';

// Column Schema for Kanban Workflow Stages (To Do, In Progress, Completed)
const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Column title is required'],
      trim: true,
      maxlength: [50, 'Title cannot exceed 50 characters'],
    },
    statusKey: {
      type: String,
      required: true,
      enum: ['todo', 'doing', 'done'],
      default: 'todo',
    },
    order: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
    },
  },
  { timestamps: true }
);

const Column = mongoose.models.Column || mongoose.model('Column', columnSchema);
export default Column;
