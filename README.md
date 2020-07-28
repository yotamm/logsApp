# LogsApp

A build log simulation app

## Get Started

Run `npm run start:server` to run the mock server.

Run `npm run start` and navigate to `http://localhost:4200/`.

## Included Frontend Features

1. An old-school styled log complete with line numbers, ANSI styling, and virtual scrolling.
2. A pin scroll to bottom button (On by default).
3. A step status summary and navigation (left pane). The background color of every step reflects its status (Success / Failure / In Progress / Unknown).
4. A rebuild button that will simulate build progression.
5. Communication with the server over HTTP & WebSocket.

## Included Backend Features

1. Quick-send already performed logs.
2. A randomized sending time to simulate build progression more realistically.

