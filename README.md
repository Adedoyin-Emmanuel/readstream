# Readstream 🎖️

Goal: Practice fast backend → frontend streaming and WebSocket updates.

**Pipeline**
User uploads README.md.

**Backend:**

1. Reads file content immediately.

2. Splits it into sections (by headings: #, ##, ###).

3. Sends first section instantly via WebSocket.

4. Streams each section as it’s processed.

**Frontend:**

1. Shows the README content in a live preview pane.

2. Each section appears in real-time as backend sends it.

3. After processing:

4. Cache uploaded file hash → instant reload next time.
