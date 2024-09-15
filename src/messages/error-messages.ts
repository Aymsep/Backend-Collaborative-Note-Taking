export const ERROR_MESSAGES = {
    NOTE_NOT_FOUND: 'Note not found',
    ACCESS_DENIED: 'Access denied',
    NOTE_ALREADY_SHARED: (targetId: number) => `Note already shared with user ${targetId}`,
    CREATE_NOTE_FAILED: 'Failed to create note',
    UPDATE_NOTE_FAILED: 'Failed to update the note',
    DELETE_NOTE_FAILED: 'Failed to delete the note',
    RETRIEVE_NOTES_FAILED: 'Failed to retrieve notes',
    RETRIEVE_NOTE_FAILED: 'Failed to retrieve the note',
    SHARE_NOTE_FAILED: 'Failed to share the note',
  };
  