# Iconography Guide

This application maintains information about Orthodox Christian saints who are featured in the iconography at St. Katherine's Orthodox Church. For each saint in a frescoe, there is a tappable NFC tag, which opens a URL to a web page, hosted here, with information about the saint depicted.

The admin, of which there is one account stored as an env var, can also access editor pages. There, they can edit the information about the saints, add links to more information, etc.

Each saint can have many `links` (for external information), many `sections` (title, body) with info, many feast days, a birth and repose date, and a name. Every time a section is modified, it is saved as a new revision, to keep an audit history (for undo-ability). Links can only be soft deleted, likewise.
