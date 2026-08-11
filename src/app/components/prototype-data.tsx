import type { Proto } from "./prototype";

/* Per-case prototype content. Illustrative / redacted — composed by the
   shared block renderer in prototype.tsx so all three read identically.
   Keyed by case-study slug. */

export const PROTOTYPES: Record<string, Proto> = {
  hobber: {
    app: "Hobber Partner",
    logo: "/logos/hobber.png",
    nav: ["Dashboard", "Bookings", "Calendar", "Pricing", "Payouts"],
    tabs: ["Jobs", "Calendar", "Earnings", "More"],
    web: [
      {
        label: "Activation",
        title: "Get Al Noor Services bookable",
        sub: "Signup done. 3 steps left before customers can book you.",
        activeNav: 0,
        blocks: [
          {
            type: "progress",
            title: "Vendor readiness",
            pct: 62,
            sub: "You're not visible in search until you hit 100%",
            steps: [
              { label: "Business details & trade license", done: true },
              { label: "Add services (4 added)", done: true },
              { label: "Set weekly availability", done: false },
              { label: "Confirm pricing per service", done: false },
              { label: "Add payout bank (IBAN)", done: false },
            ],
          },
          {
            type: "stats",
            items: [
              { label: "Profile views / wk", value: "0", delta: "locked" },
              { label: "Services live", value: "0 / 4" },
              { label: "Est. time to go live", value: "8 min" },
            ],
          },
          { type: "cta", cta: "Set availability & go live" },
        ],
      },
      {
        label: "Services",
        title: "Services & pricing",
        sub: "Set what you offer and what you charge. Prices show to customers instantly.",
        activeNav: 3,
        blocks: [
          {
            type: "list",
            title: "Your service catalog",
            items: [
              { label: "Deep Cleaning (per hr)", meta: "AED 45/hr · 2 cleaners min", tag: "Cleaning", status: "Live" },
              { label: "Move-out Clean (studio)", meta: "AED 320 flat · 4 hrs", tag: "Cleaning", status: "Live" },
              { label: "AC Servicing (split unit)", meta: "AED 120/unit", tag: "AC", status: "Draft" },
            ],
          },
          {
            type: "form",
            title: "Edit: AC Servicing (split unit)",
            items: [
              { label: "Base price", value: "AED 120 / unit" },
              { label: "Duration", value: "45 min / unit" },
              { label: "Weekend surcharge", value: "+AED 20" },
            ],
            cta: "Publish service",
          },
        ],
      },
      {
        "label": "Availability",
        "title": "Weekly availability",
        "sub": "Set when Al Noor Services can take bookings — the last readiness gate before going live.",
        "activeNav": 2,
        "blocks": [
          {
            "type": "note",
            "title": "July 2026",
            "text": "9-5 Mon-Sat · open. Fri half day · 9-1. Sun closed. Selected week ready for demand."
          },
          {
            "type": "pills",
            "pills": [
              "Mon 9-17",
              "Tue 9-17",
              "Wed 9-17",
              "Thu 9-17",
              "Fri 9-13",
              "Sat 9-17",
              "Sun off",
              "+ add slot"
            ]
          },
          {
            "type": "cta",
            "title": "Schedule readiness complete",
            "sub": "All four activation gates met — onboarding, services, pricing, and schedule. Al Noor Services is ready for demand.",
            "cta": "Go live"
          }
        ]
      },
      {
        "label": "Go-live",
        "title": "You are live on Hobber",
        "sub": "Al Noor Services is live — visible to customers across the marketplace.",
        "activeNav": 2,
        "blocks": [
          {
            "type": "progress",
            "title": "Vendor activation",
            "pct": 100,
            "sub": "Registered → bookable · 0 manual ops touches",
            "steps": [
              {
                "label": "Onboarding complete",
                "done": true
              },
              {
                "label": "Services configured",
                "done": true
              },
              {
                "label": "Pricing set (AED)",
                "done": true
              },
              {
                "label": "Weekly availability set",
                "done": true
              }
            ]
          },
          {
            "type": "stats",
            "items": [
              {
                "label": "Status",
                "value": "Live",
                "delta": "bookable"
              },
              {
                "label": "Bookable slots / wk",
                "value": "51",
                "delta": "+51"
              },
              {
                "label": "Avg service price",
                "value": "AED 180",
                "delta": "set"
              }
            ]
          },
          {
            "type": "cta",
            "title": "What happens next",
            "sub": "New booking requests route straight to your calendar. Confirm within 2 hours to keep your response rate high.",
            "cta": "View bookings"
          }
        ]
      },
      {
        label: "Bookings",
        title: "Incoming bookings",
        sub: "3 need action. Confirm within 30 min to protect your rank.",
        activeNav: 1,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "New requests", value: "3", delta: "+2 today" },
              { label: "Accept rate", value: "94%", delta: "+4%" },
              { label: "Avg response", value: "6 min" },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Deep Clean · Fatima H.", meta: "Today 14:00 · JLT Cluster M · AED 180", status: "Pending" },
              { label: "AC Service ×3 · Omar A.", meta: "Tomorrow 10:00 · Marina Gate · AED 360", status: "Pending" },
              { label: "Move-out Clean · Priya S.", meta: "Thu 09:00 · Barsha Heights · AED 320", status: "Pending" },
              { label: "Handyman 2h · Khalid M.", meta: "Yesterday · Tecom · AED 150", status: "Confirmed" },
            ],
          },
          { type: "note", text: "Auto-decline turns on after 30 min of no response." },
        ],
      },
      {
        label: "Payouts",
        title: "Earnings & payouts",
        sub: "Weekly payout every Monday to your linked IBAN.",
        activeNav: 4,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "This week", value: "AED 4,280", delta: "+18%" },
              { label: "Next payout", value: "AED 3,610" },
              { label: "Hobber fee (15%)", value: "-AED 642" },
            ],
          },
          {
            type: "chart",
            title: "Earnings last 8 weeks",
            bars: [40, 55, 48, 62, 70, 58, 82, 91],
            statValue: "AED 31,940",
            statLabel: "Paid out YTD",
          },
          {
            type: "list",
            title: "Recent payouts",
            items: [
              { label: "Payout #2048", meta: "Mon 30 Jun · 22 jobs", status: "Confirmed" },
              { label: "Payout #2039", meta: "Mon 23 Jun · 19 jobs", status: "Confirmed" },
              { label: "Payout #2031", meta: "Mon 16 Jun · 24 jobs", status: "Confirmed" },
            ],
          },
        ],
      },
    ],
    tablet: [
      {
        label: "Overview",
        title: "Al Noor Services — Dashboard",
        sub: "Tuesday 1 July · Dubai",
        activeNav: 0,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "Status", value: "Live", delta: "bookable" },
              { label: "Jobs / wk", value: "22", delta: "+3" },
              { label: "Rating", value: "4.8", delta: "+0.1" },
              { label: "This week", value: "AED 4,280" },
            ],
          },
          {
            type: "chart",
            title: "Bookings this week",
            bars: [30, 45, 60, 52, 78, 90, 40],
            statValue: "22",
            statLabel: "Mon–Sun bookings",
          },
          {
            type: "list",
            title: "Upcoming bookings",
            items: [
              { label: "Deep Clean · Fatima H.", meta: "Today 14:00 · JLT", status: "Confirmed" },
              { label: "AC Service ×3 · Omar A.", meta: "Wed 10:00 · Marina", status: "Pending" },
              { label: "Move-out · Priya S.", meta: "Thu 09:00 · Barsha", status: "Pending" },
            ],
          },
        ],
      },
      {
        label: "Bookings",
        title: "Booking pipeline",
        sub: "Drag to accept, schedule, or close out jobs",
        activeNav: 1,
        blocks: [
          {
            type: "kanban",
            columns: [
              {
                name: "Requests",
                cards: [
                  { title: "AC Service ×3 · Omar A.", meta: "Wed 10:00 · AED 360", done: false },
                  { title: "Move-out · Priya S.", meta: "Thu 09:00 · AED 320", done: false },
                ],
              },
              {
                name: "Scheduled",
                cards: [
                  { title: "Deep Clean · Fatima H.", meta: "Today 14:00 · AED 180", done: false },
                  { title: "Handyman · Sara T.", meta: "Today 17:00 · AED 150", done: false },
                ],
              },
              {
                name: "Done",
                cards: [
                  { title: "Deep Clean · Khalid M.", meta: "AED 200 · rated 5.0", done: true },
                  { title: "AC Service · Layla R.", meta: "AED 120 · rated 4.5", done: true },
                ],
              },
            ],
          },
          {
            type: "stats",
            items: [
              { label: "Accept rate", value: "94%" },
              { label: "Completion", value: "98%" },
              { label: "Repeat clients", value: "41%", delta: "+6%" },
            ],
          },
        ],
      },
    ],
    mobile: [
      {
        label: "Today",
        title: "Today's jobs",
        sub: "Tue 1 Jul · 3 jobs · AED 510",
        activeNav: 0,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "Jobs", value: "3" },
              { label: "Earnings", value: "AED 510" },
              { label: "Next", value: "14:00" },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Deep Clean · Fatima H.", meta: "14:00 · JLT Cluster M", status: "Confirmed" },
              { label: "Handyman 2h · Sara T.", meta: "17:00 · Tecom", status: "Confirmed" },
              { label: "AC Service · Omar A.", meta: "19:30 · Marina Gate", status: "Pending" },
            ],
          },
          { type: "cta", cta: "Start next job" },
        ],
      },
      {
        label: "On-site",
        title: "Deep Clean · Fatima H.",
        sub: "JLT Cluster M · Apt 1204 · AED 180",
        activeNav: 0,
        blocks: [
          {
            type: "progress",
            title: "Job in progress",
            pct: 60,
            sub: "Started 14:05 · est. 2h 00m",
            steps: [
              { label: "Arrived & checked in", done: true },
              { label: "Before photos uploaded", done: true },
              { label: "Clean in progress", done: false },
              { label: "After photos & customer sign-off", done: false },
            ],
          },
          { type: "pills", pills: ["2 cleaners", "Kitchen", "2 baths", "Balcony"] },
          { type: "cta", cta: "Mark complete" },
        ],
      },
      {
        "label": "Job complete",
        "title": "Job complete",
        "sub": "Villa 12, Al Barsha · AC servicing",
        "activeNav": 0,
        "blocks": [
          {
            "type": "progress",
            "title": "Al Noor Services · Job #4821",
            "pct": 100,
            "sub": "Marked complete · awaiting customer confirmation",
            "steps": [
              {
                "label": "On the way",
                "done": true
              },
              {
                "label": "Checked in on-site",
                "done": true
              },
              {
                "label": "Work completed",
                "done": true
              },
              {
                "label": "Payout queued",
                "done": true
              }
            ]
          },
          {
            "type": "stats",
            "items": [
              {
                "label": "Job total",
                "value": "AED 220",
                "delta": ""
              },
              {
                "label": "Your payout",
                "value": "AED 187",
                "delta": "after fee"
              },
              {
                "label": "Payout ETA",
                "value": "T+2",
                "delta": ""
              }
            ]
          },
          {
            "type": "cta",
            "title": "Nice work",
            "sub": "Payout of AED 187 is queued to your next cycle. Ask the customer to rate the job to boost your ranking.",
            "cta": "Back to jobs"
          }
        ]
      },
      {
        label: "Earnings",
        title: "Earnings",
        sub: "Next payout Mon 7 Jul",
        activeNav: 2,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "This week", value: "AED 4,280", delta: "+18%" },
              { label: "Pending", value: "AED 3,610" },
            ],
          },
          {
            type: "chart",
            title: "Last 7 days",
            bars: [45, 60, 52, 78, 90, 40, 66],
            statValue: "AED 4,280",
            statLabel: "Earned this week",
          },
          {
            type: "list",
            title: "Recent jobs",
            items: [
              { label: "Deep Clean · Khalid M.", meta: "Mon · AED 200", status: "Paid" },
            ],
          },
        ],
      },
    ],
  },

  axinom: {
    "app": "Axinom Mosaic",
    "logo": "/logos/axinom.png",
    "nav": [
      "Environments",
      "Service Accounts",
      "Logs",
      "Connections",
      "Analytics"
    ],
    "tabs": [
      "Home",
      "Services",
      "Alerts",
      "More"
    ],
    "web": [
      {
        "label": "Environments",
        "title": "Environments",
        "sub": "3 environments across 1 tenant",
        "activeNav": 0,
        "blocks": [
          {
            "type": "table",
            "title": "All Environments",
            "cols": [
              "Environment",
              "Type",
              "Region",
              "State"
            ],
            "rows": [
              {
                "cells": [
                  "Prod-01",
                  "Production",
                  "eu-central-1"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Staging",
                  "Staging",
                  "eu-central-1"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Ruwan-Test",
                  "Development",
                  "eu-west-1"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Sandbox-QA",
                  "Development",
                  "us-east-1"
                ],
                "status": "Disabled"
              }
            ]
          },
          {
            "type": "stats",
            "items": [
              {
                "label": "Enabled",
                "value": "3"
              },
              {
                "label": "Managed Services",
                "value": "20"
              },
              {
                "label": "Tenant",
                "value": "tnt_9c••••"
              }
            ]
          }
        ]
      },
      {
        "label": "Environment Details",
        "title": "Prod-01",
        "crumbs": [
          "Environments",
          "Prod-01"
        ],
        "activeNav": 0,
        "blocks": [
          {
            "type": "fields",
            "title": "Overview",
            "items": [
              {
                "label": "Name",
                "value": "Prod-01"
              },
              {
                "label": "Environment Type",
                "value": "Production"
              },
              {
                "label": "Status",
                "value": "Enabled"
              }
            ]
          },
          {
            "type": "table",
            "title": "Managed Services",
            "cols": [
              "Service",
              "Version",
              "State"
            ],
            "rows": [
              {
                "cells": [
                  "Micro Frontend Service",
                  "v3.12.0"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Management System",
                  "v3.12.0"
                ],
                "status": "Running"
              },
              {
                "cells": [
                  "Hosting",
                  "v2.8.4"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Identity",
                  "v4.1.2"
                ],
                "status": "Running"
              },
              {
                "cells": [
                  "DRM License",
                  "v5.0.1"
                ],
                "status": "Running"
              }
            ]
          },
          {
            "type": "fields",
            "title": "Metadata",
            "items": [
              {
                "label": "Environment ID",
                "value": "env_••••3f2a"
              },
              {
                "label": "Created",
                "value": "2026-02-14 09:22 UTC"
              },
              {
                "label": "Tenant ID",
                "value": "tnt_9c••••"
              }
            ]
          }
        ],
        "split": true
      },
      {
        "label": "Service Accounts",
        "title": "Service Accounts",
        "sub": "Prod-01 · 4 machine identities",
        "activeNav": 1,
        "crumbs": [
          "Environments",
          "Prod-01",
          "Service Accounts"
        ],
        "blocks": [
          {
            "type": "table",
            "title": "Accounts",
            "cols": [
              "Account",
              "Scope",
              "Key",
              "State"
            ],
            "rows": [
              {
                "cells": [
                  "ingest-pipeline",
                  "content:write",
                  "svc_••••2f"
                ],
                "status": "Active"
              },
              {
                "cells": [
                  "drm-license-issuer",
                  "license:sign",
                  "svc_••••7b"
                ],
                "status": "Active"
              },
              {
                "cells": [
                  "cdn-purge-bot",
                  "hosting:purge",
                  "svc_••••a1"
                ],
                "status": "Active"
              },
              {
                "cells": [
                  "legacy-report-sync",
                  "analytics:read",
                  "svc_••••d9"
                ],
                "status": "Revoked"
              }
            ]
          },
          {
            "type": "stats",
            "items": [
              {
                "label": "Active",
                "value": "3"
              },
              {
                "label": "Revoked",
                "value": "1"
              },
              {
                "label": "Key rotation",
                "value": "90d"
              }
            ]
          }
        ]
      },
      {
        "label": "Connections",
        "title": "Connections",
        "sub": "Prod-01 · upstream & delivery links",
        "activeNav": 3,
        "blocks": [
          {
            "type": "list",
            "title": "API & CDN Connections",
            "items": [
              {
                "label": "Management System API",
                "meta": "conn_••••4c · REST · eu-central-1",
                "status": "Connected"
              },
              {
                "label": "DRM License Gateway",
                "meta": "conn_••••8e · gRPC · key exchange",
                "status": "Connected"
              },
              {
                "label": "CDN Origin · edge eu-c1",
                "meta": "conn_••••1a · HLS/DASH pull",
                "status": "Connected"
              },
              {
                "label": "CDN Origin · edge us-e1",
                "meta": "conn_••••b3 · origin retry 2/3",
                "status": "Degraded"
              },
              {
                "label": "Analytics Ingest Stream",
                "meta": "conn_••••6f · webhook · 480ms lag",
                "status": "Degraded"
              }
            ]
          },
          {
            "type": "pills",
            "pills": [
              "Connected 3",
              "Degraded 2",
              "Failed 0",
              "Health check 30s"
            ]
          }
        ]
      },
      {
        "label": "Logs",
        "title": "Service Log Messages",
        "sub": "Prod-01 · last 30 min · live tail",
        "activeNav": 2,
        "blocks": [
          {
            "type": "list",
            "title": "Recent Entries",
            "items": [
              {
                "label": "DRM License issued · key_id key_••••7b",
                "meta": "10:42:18 · DRM License",
                "status": "OK",
                "tag": "info"
              },
              {
                "label": "Ingest job completed · asset ast_••••c4",
                "meta": "10:41:55 · Management System",
                "status": "OK",
                "tag": "info"
              },
              {
                "label": "Token refresh latency 480ms",
                "meta": "10:40:12 · Identity",
                "status": "Pending",
                "tag": "warn"
              },
              {
                "label": "CDN origin retry (2/3) · edge eu-c1",
                "meta": "10:38:47 · Hosting",
                "status": "Pending",
                "tag": "warn"
              }
            ]
          },
          {
            "type": "pills",
            "pills": [
              "info 214",
              "warn 12",
              "error 0",
              "Auto-refresh 5s"
            ]
          }
        ]
      },
      {
        "label": "Playback Services",
        "title": "Playback Services",
        "sub": "Prod-01 · streaming health",
        "activeNav": 4,
        "blocks": [
          {
            "type": "stats",
            "items": [
              {
                "label": "Playback Success",
                "value": "99.2%",
                "delta": "+1.5%"
              },
              {
                "label": "Rebuffer Ratio",
                "value": "0.6%",
                "delta": "-0.3%"
              },
              {
                "label": "Concurrent Streams",
                "value": "18.4k"
              }
            ]
          },
          {
            "type": "chart",
            "title": "Startup time p95 (ms)",
            "bars": [
              62,
              58,
              64,
              55,
              49,
              52,
              47,
              44,
              41,
              43
            ],
            "statValue": "1.9s",
            "statLabel": "median start"
          },
          {
            "type": "list",
            "title": "Active Streams",
            "items": [
              {
                "label": "Live · Channel-A HD",
                "meta": "DASH+CENC · 6.2k viewers",
                "status": "Running"
              },
              {
                "label": "VOD · asset ast_••••9d",
                "meta": "HLS+FairPlay · 3.1k",
                "status": "Running"
              },
              {
                "label": "Live · Channel-B UHD",
                "meta": "DASH+Widevine · rebuffering",
                "status": "Rebuffer"
              }
            ]
          }
        ],
        "split": true
      }
    ],
    "tablet": [
      {
        "label": "Environment",
        "title": "Prod-01",
        "crumbs": [
          "Environments",
          "Prod-01"
        ],
        "activeNav": 0,
        "blocks": [
          {
            "type": "fields",
            "title": "Overview",
            "items": [
              {
                "label": "Name",
                "value": "Prod-01"
              },
              {
                "label": "Environment Type",
                "value": "Production"
              },
              {
                "label": "Status",
                "value": "Enabled"
              },
              {
                "label": "Environment ID",
                "value": "env_••••3f2a"
              }
            ]
          },
          {
            "type": "table",
            "title": "Managed Services",
            "cols": [
              "Service",
              "State"
            ],
            "rows": [
              {
                "cells": [
                  "Micro Frontend Service"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Management System"
                ],
                "status": "Running"
              },
              {
                "cells": [
                  "Hosting"
                ],
                "status": "Enabled"
              },
              {
                "cells": [
                  "Identity"
                ],
                "status": "Running"
              },
              {
                "cells": [
                  "DRM License"
                ],
                "status": "Running"
              }
            ]
          }
        ]
      },
      {
        "label": "Analytics",
        "title": "Playback Analytics",
        "sub": "Prod-01 · trailing 24h",
        "activeNav": 4,
        "blocks": [
          {
            "type": "stats",
            "items": [
              {
                "label": "Playback Success",
                "value": "99.2%",
                "delta": "+1.5%"
              },
              {
                "label": "Rebuffer",
                "value": "0.6%",
                "delta": "-0.3%"
              },
              {
                "label": "DRM Licenses",
                "value": "4.7M"
              }
            ]
          },
          {
            "type": "chart",
            "title": "Concurrent streams (hourly)",
            "bars": [
              30,
              38,
              44,
              52,
              60,
              71,
              84,
              92,
              88,
              76,
              63,
              51
            ],
            "statValue": "18.4k",
            "statLabel": "peak concurrency"
          }
        ]
      }
    ],
    "mobile": [
      {
        "label": "Home",
        "title": "Prod-01 Ops",
        "sub": "All services nominal",
        "activeNav": 0,
        "blocks": [
          {
            "type": "list",
            "title": "Services Status",
            "items": [
              {
                "label": "Micro Frontend Service",
                "meta": "v3.12.0",
                "status": "Enabled"
              },
              {
                "label": "Management System",
                "meta": "v3.12.0",
                "status": "Running"
              },
              {
                "label": "Hosting",
                "meta": "v2.8.4",
                "status": "Enabled"
              },
              {
                "label": "Identity",
                "meta": "v4.1.2",
                "status": "Running"
              },
              {
                "label": "DRM License",
                "meta": "v5.0.1",
                "status": "Running"
              }
            ]
          },
          {
            "type": "stats",
            "items": [
              {
                "label": "Playback",
                "value": "99.2%"
              },
              {
                "label": "Streams",
                "value": "18.4k"
              }
            ]
          }
        ]
      },
      {
        "label": "Alerts",
        "title": "Alerts",
        "sub": "2 active · Prod-01",
        "activeNav": 2,
        "blocks": [
          {
            "type": "list",
            "title": "Active",
            "items": [
              {
                "label": "Channel-B UHD rebuffering",
                "meta": "Playback · 4 min ago",
                "status": "Rebuffer",
                "tag": "warn"
              },
              {
                "label": "Identity token latency high",
                "meta": "Identity · 8 min ago",
                "status": "Pending",
                "tag": "warn"
              }
            ]
          },
          {
            "type": "list",
            "title": "Resolved",
            "items": [
              {
                "label": "CDN origin retry cleared",
                "meta": "Hosting · 22 min ago",
                "status": "OK"
              },
              {
                "label": "DRM key rotation complete",
                "meta": "DRM License · 1h ago",
                "status": "OK"
              }
            ]
          }
        ]
      }
    ]
  },

  kodez: {
    "app": "Kodez Console",
    "logo": "/logos/kodez.png",
    "nav": [
      "Jobs",
      "Helpdesk",
      "Field",
      "Logistics",
      "Reports"
    ],
    "tabs": [
      "Jobs",
      "Routes",
      "Proof",
      "More"
    ],
    "web": [
      {
        "label": "Hub",
        "title": "Service hub",
        "sub": "Single access point across portal, helpdesk, field and warehouse",
        "activeNav": 0,
        "blocks": [
          {
            "type": "hub",
            "tiles": [
              {
                "n": "01",
                "title": "Customer Portal",
                "links": [
                  "Portal Login",
                  "Create Job"
                ]
              },
              {
                "n": "02",
                "title": "Helpdesk",
                "links": [
                  "Helpdesk Login",
                  "Create Job",
                  "Locations"
                ]
              },
              {
                "n": "03",
                "title": "Mobile / Field",
                "links": [
                  "Mobile Login",
                  "My Parts",
                  "Parts Receive",
                  "Parts Return"
                ]
              },
              {
                "n": "04",
                "title": "Logistics",
                "links": [
                  "Warehouse Login",
                  "Shipments",
                  "Pick Tasks",
                  "Repairs"
                ]
              }
            ]
          },
          {
            "type": "stats",
            "items": [
              {
                "label": "Open jobs",
                "value": "342",
                "delta": "+18 today"
              },
              {
                "label": "SLA breach risk",
                "value": "11",
                "delta": "-3"
              },
              {
                "label": "In transit",
                "value": "57"
              },
              {
                "label": "Techs on route",
                "value": "24"
              }
            ]
          }
        ]
      },
      {
        "label": "Jobs",
        "title": "Create Job",
        "sub": "Raise a service job and route it to the right queue",
        "activeNav": 0,
        "crumbs": [
          "Jobs",
          "New"
        ],
        "blocks": [
          {
            "type": "form",
            "title": "New service job",
            "items": [
              {
                "label": "Client",
                "value": "Meridian Facilities ••••"
              },
              {
                "label": "Type",
                "value": "On-site repair — HVAC"
              },
              {
                "label": "Priority",
                "value": "P2 — High (8h SLA)"
              },
              {
                "label": "Assignee",
                "value": "Field queue · Zone North"
              }
            ],
            "cta": "Create job"
          },
          {
            "type": "note",
            "text": "Prefilled from this asset and the client's last 3 jobs. Parts, warranty and SLA policy carry over automatically."
          }
        ]
      },
      {
        "label": "Helpdesk",
        "title": "Helpdesk Queue",
        "sub": "Support tickets across all active clients",
        "activeNav": 1,
        "crumbs": [
          "Helpdesk",
          "Queue"
        ],
        "blocks": [
          {
            "type": "pills",
            "pills": [
              "All 42",
              "Open 18",
              "In progress 15",
              "Resolved 9"
            ]
          },
          {
            "type": "table",
            "cols": [
              "Ticket",
              "Client",
              "Priority",
              "State"
            ],
            "rows": [
              {
                "cells": [
                  "tkt_••••7a",
                  "Meridian Co",
                  "High",
                  "Open"
                ],
                "status": "Open"
              },
              {
                "cells": [
                  "tkt_••••3f",
                  "Northbay Ltd",
                  "Medium",
                  "In progress"
                ],
                "status": "In progress"
              },
              {
                "cells": [
                  "tkt_••••9c",
                  "Apex Retail",
                  "High",
                  "In progress"
                ],
                "status": "In progress"
              },
              {
                "cells": [
                  "tkt_••••2e",
                  "Meridian Co",
                  "Low",
                  "Resolved"
                ],
                "status": "Resolved"
              },
              {
                "cells": [
                  "tkt_••••5b",
                  "Orbit Foods",
                  "Medium",
                  "Open"
                ],
                "status": "Open"
              }
            ]
          }
        ]
      },
      {
        "label": "Logistics",
        "title": "Shipments",
        "sub": "Outbound and return legs across depots",
        "activeNav": 3,
        "crumbs": [
          "Logistics",
          "Shipments"
        ],
        "blocks": [
          {
            "type": "table",
            "cols": [
              "Shipment",
              "Route",
              "ETA",
              "State"
            ],
            "rows": [
              {
                "cells": [
                  "shp_••••4a2",
                  "DXB-01 → Zone North",
                  "14:20"
                ],
                "status": "Running"
              },
              {
                "cells": [
                  "shp_••••9f7",
                  "AUH-02 → Client site",
                  "—"
                ],
                "status": "OK"
              },
              {
                "cells": [
                  "shp_••••1c8",
                  "DXB-01 → Zone West",
                  "16:05"
                ],
                "status": "Pending"
              },
              {
                "cells": [
                  "shp_••••63e",
                  "Return → Repair hub",
                  "11:40"
                ],
                "status": "Running"
              },
              {
                "cells": [
                  "shp_••••8b0",
                  "SHJ-03 → Zone East",
                  "—"
                ],
                "status": "OK"
              }
            ]
          },
          {
            "type": "pills",
            "pills": [
              "In transit 57",
              "Delivered 214",
              "Pending 9",
              "Exceptions 3"
            ]
          }
        ]
      },
      {
        "label": "Warehouse",
        "title": "Pick Tasks",
        "sub": "Wave 0714 · Depot DXB-01",
        "activeNav": 3,
        "crumbs": [
          "Logistics",
          "Pick Tasks"
        ],
        "blocks": [
          {
            "type": "kanban",
            "columns": [
              {
                "name": "Queued",
                "cards": [
                  {
                    "title": "pick_••••a3 · 6 lines",
                    "meta": "Job jb_••••27 · Bin A-12",
                    "done": false
                  },
                  {
                    "title": "pick_••••b8 · 2 lines",
                    "meta": "Job jb_••••44 · Bin C-03",
                    "done": false
                  }
                ]
              },
              {
                "name": "Picking",
                "cards": [
                  {
                    "title": "pick_••••c1 · 9 lines",
                    "meta": "Rafiq K. · Bin D-07",
                    "done": false
                  }
                ]
              },
              {
                "name": "Packed",
                "cards": [
                  {
                    "title": "pick_••••d5 · 4 lines",
                    "meta": "→ shp_••••4a2",
                    "done": true
                  },
                  {
                    "title": "pick_••••e2 · 1 line",
                    "meta": "→ shp_••••63e",
                    "done": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "label": "Reports",
        "title": "Operations Reports",
        "sub": "Service performance across the last 30 days",
        "activeNav": 4,
        "split": true,
        "crumbs": [
          "Reports",
          "Overview"
        ],
        "blocks": [
          {
            "type": "stats",
            "items": [
              {
                "label": "SLA met",
                "value": "94.2%",
                "delta": "+2.1%"
              },
              {
                "label": "Avg resolution",
                "value": "6.4h",
                "delta": "-0.8h"
              },
              {
                "label": "Jobs closed",
                "value": "1,284",
                "delta": "+112"
              }
            ]
          },
          {
            "type": "chart",
            "title": "Jobs closed per week",
            "bars": [
              212,
              248,
              231,
              276,
              264,
              289
            ],
            "statValue": "1,284",
            "statLabel": "closed this cycle"
          }
        ]
      }
    ],
    "tablet": [
      {
        "label": "Jobs",
        "title": "Jobs board",
        "sub": "Live queue across zones",
        "activeNav": 0,
        "blocks": [
          {
            "type": "kanban",
            "columns": [
              {
                "name": "New",
                "cards": [
                  {
                    "title": "jb_••••27 · HVAC repair",
                    "meta": "Meridian · P2 · Zone North",
                    "done": false
                  },
                  {
                    "title": "jb_••••31 · Install",
                    "meta": "Aster Retail · P3",
                    "done": false
                  }
                ]
              },
              {
                "name": "Dispatched",
                "cards": [
                  {
                    "title": "jb_••••44 · Diagnostic",
                    "meta": "Rafiq K. · ETA 14:20",
                    "done": false
                  }
                ]
              },
              {
                "name": "On site",
                "cards": [
                  {
                    "title": "jb_••••19 · Panel swap",
                    "meta": "Nadia S. · SLA 2h",
                    "done": false
                  }
                ]
              },
              {
                "name": "Closed",
                "cards": [
                  {
                    "title": "jb_••••02 · Reset",
                    "meta": "Signed off 11:05",
                    "done": true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "label": "Reports",
        "title": "Modules & reports",
        "sub": "Service performance across the last 30 days",
        "activeNav": 4,
        "blocks": [
          {
            "type": "chart",
            "title": "Jobs closed per day",
            "bars": [
              42,
              55,
              38,
              61,
              74,
              49,
              68
            ],
            "statValue": "94.2%",
            "statLabel": "SLA met (30d)"
          },
          {
            "type": "list",
            "title": "Module health",
            "items": [
              {
                "label": "Helpdesk",
                "meta": "128 open tickets",
                "value": "OK"
              },
              {
                "label": "Field / Mobile",
                "meta": "24 techs live",
                "value": "OK"
              },
              {
                "label": "Logistics",
                "meta": "3 exceptions",
                "value": "Watch"
              },
              {
                "label": "Repairs hub",
                "meta": "17 in queue",
                "value": "OK"
              }
            ]
          }
        ]
      }
    ],
    "mobile": [
      {
        "label": "Field",
        "title": "Dispatch",
        "sub": "jb_••••27 · Meridian Facilities",
        "activeNav": 0,
        "blocks": [
          {
            "type": "progress",
            "title": "Job progress",
            "pct": 60,
            "sub": "P2 · SLA 8h · Zone North",
            "steps": [
              {
                "label": "Accepted",
                "done": true
              },
              {
                "label": "En route",
                "done": true
              },
              {
                "label": "On site",
                "done": true
              },
              {
                "label": "Repair",
                "done": false
              },
              {
                "label": "Sign-off",
                "done": false
              }
            ]
          },
          {
            "type": "fields",
            "title": "Job detail",
            "items": [
              {
                "label": "Asset",
                "value": "ast_••••7d1"
              },
              {
                "label": "Parts",
                "value": "2 picked · 1 return"
              },
              {
                "label": "ETA",
                "value": "14:20"
              }
            ]
          }
        ]
      },
      {
        "label": "Proof",
        "title": "Proof of delivery",
        "sub": "jb_••••27 · close-out",
        "activeNav": 2,
        "blocks": [
          {
            "type": "form",
            "title": "Capture POD",
            "items": [
              {
                "label": "Received by",
                "value": "M. Rahman"
              },
              {
                "label": "Parts used",
                "value": "prt_••••3f · prt_••••a1"
              },
              {
                "label": "Signature",
                "value": "Captured"
              },
              {
                "label": "Photo",
                "value": "2 attached"
              }
            ],
            "cta": "Submit & close job"
          },
          {
            "type": "note",
            "text": "POD syncs to job jb_••••27 and triggers the return leg shp_••••63e to the repair hub."
          }
        ]
      }
    ]
  },

  rasoft: {
    app: "RaSoft People",
    logo: "/logos/rasoft.svg",
    nav: ["Dashboard", "Approvals", "Attendance", "People", "Onboarding"],
    tabs: ["Home", "Leave", "Clock", "More"],
    web: [
      {
        label: "Dashboard",
        title: "Today across the team",
        sub: "Tue 1 Jul · Colombo HQ · single source of truth for HR & ops",
        activeNav: 0,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "Present today", value: "112 / 128", delta: "88%" },
              { label: "On leave", value: "9" },
              { label: "Pending approvals", value: "7", delta: "3 due today" },
              { label: "Onboarding", value: "2" },
            ],
          },
          {
            type: "list",
            title: "Needs your action",
            items: [
              { label: "Annual leave · Dilani P.", meta: "5 days · 14–18 Jul · Engineering", status: "Pending" },
              { label: "Sick leave · Ruwan J.", meta: "1 day · today · Finance", status: "Pending" },
              { label: "WFH request · Nadeesha K.", meta: "2 days · 3–4 Jul · Support", status: "Pending" },
              { label: "Attendance correction · Kasun M.", meta: "Missed clock-out · Mon 30 Jun", status: "Review" },
            ],
          },
          {
            type: "chart",
            title: "Attendance this week",
            bars: [96, 92, 88, 90, 94, 61, 12],
            statValue: "91%",
            statLabel: "avg attendance",
          },
        ],
      },
      {
        label: "Approvals",
        title: "Leave & approval queue",
        sub: "Every request routes here — no more chasing sign-off across desks and inboxes.",
        activeNav: 1,
        crumbs: ["Approvals", "Pending"],
        blocks: [
          {
            type: "table",
            title: "Awaiting decision",
            cols: ["Request", "Employee", "Dates", "State"],
            rows: [
              { cells: ["Annual leave", "Dilani P.", "14–18 Jul"], status: "Pending" },
              { cells: ["Sick leave", "Ruwan J.", "Today"], status: "Pending" },
              { cells: ["WFH", "Nadeesha K.", "3–4 Jul"], status: "Pending" },
              { cells: ["Annual leave", "Sahan D.", "21–25 Jul"], status: "Approved" },
              { cells: ["Casual leave", "Ishara W.", "8 Jul"], status: "Approved" },
            ],
          },
          {
            type: "stats",
            items: [
              { label: "Pending", value: "3" },
              { label: "Approved (wk)", value: "18" },
              { label: "Avg decision time", value: "4h", delta: "was 2 days" },
            ],
          },
        ],
      },
      {
        label: "Request",
        title: "Annual leave · Dilani P.",
        sub: "One record, one approval trail — replacing three spreadsheets that never agreed.",
        activeNav: 1,
        crumbs: ["Approvals", "Dilani P.", "LR-2048"],
        split: true,
        blocks: [
          {
            type: "fields",
            title: "Request LR-2048",
            items: [
              { label: "Type", value: "Annual leave" },
              { label: "Dates", value: "14–18 Jul (5 days)" },
              { label: "Balance after", value: "9 of 21 days" },
              { label: "Cover", value: "Sahan D." },
            ],
          },
          {
            type: "progress",
            title: "Approval trail",
            pct: 66,
            sub: "Auto-routed to reporting manager, then HR — no manual chasing",
            steps: [
              { label: "Submitted by Dilani P.", done: true },
              { label: "Manager review — approved", done: true },
              { label: "HR confirmation", done: false },
              { label: "Calendar & payroll synced", done: false },
            ],
          },
          {
            type: "form",
            title: "HR decision",
            items: [
              { label: "Leave balance check", value: "Passed" },
              { label: "Team clash check", value: "None" },
              { label: "Policy", value: "Within limit" },
            ],
            cta: "Approve & sync",
          },
        ],
      },
      {
        label: "Attendance",
        title: "Attendance register",
        sub: "Tue 1 Jul · live clock-ins replacing the paper sign-in sheet",
        activeNav: 2,
        crumbs: ["Attendance", "Today"],
        blocks: [
          {
            type: "table",
            title: "Today's register",
            cols: ["Employee", "Dept", "In", "State"],
            rows: [
              { cells: ["Dilani P.", "Engineering", "08:52"], status: "Present" },
              { cells: ["Ruwan J.", "Finance", "—"], status: "On leave" },
              { cells: ["Nadeesha K.", "Support", "09:04"], status: "Present" },
              { cells: ["Kasun M.", "Engineering", "09:41"], status: "Late" },
              { cells: ["Ishara W.", "People", "08:47"], status: "Present" },
            ],
          },
          {
            type: "stats",
            items: [
              { label: "Present", value: "112" },
              { label: "Late", value: "6" },
              { label: "On leave", value: "9" },
              { label: "Not clocked", value: "1" },
            ],
          },
        ],
      },
      {
        label: "Onboarding",
        title: "New joiner — Amaya S.",
        sub: "Software Engineer · starts Mon 7 Jul · paper forms retired",
        activeNav: 4,
        crumbs: ["Onboarding", "Amaya S."],
        blocks: [
          {
            type: "progress",
            title: "Onboarding checklist",
            pct: 50,
            sub: "Every step logged to one record instead of scattered forms",
            steps: [
              { label: "Offer accepted & profile created", done: true },
              { label: "Documents collected (NIC, bank, EPF)", done: true },
              { label: "IT & workspace provisioning", done: false },
              { label: "Policy sign-off & first-week plan", done: false },
            ],
          },
          {
            type: "cta",
            title: "Ready to activate",
            sub: "Finish provisioning to auto-create login, leave balance, and attendance profile for Amaya on day one.",
            cta: "Complete onboarding",
          },
        ],
      },
    ],
    tablet: [
      {
        label: "Approvals",
        title: "Approval board",
        sub: "Requests moving through sign-off",
        activeNav: 1,
        blocks: [
          {
            type: "kanban",
            columns: [
              {
                name: "Submitted",
                cards: [
                  { title: "Sick leave · Ruwan J.", meta: "1 day · today", done: false },
                  { title: "WFH · Nadeesha K.", meta: "2 days · 3–4 Jul", done: false },
                ],
              },
              {
                name: "Manager review",
                cards: [
                  { title: "Annual leave · Dilani P.", meta: "5 days · 14–18 Jul", done: false },
                ],
              },
              {
                name: "Approved",
                cards: [
                  { title: "Annual · Sahan D.", meta: "21–25 Jul · synced", done: true },
                  { title: "Casual · Ishara W.", meta: "8 Jul · synced", done: true },
                ],
              },
            ],
          },
          {
            type: "stats",
            items: [
              { label: "Pending", value: "3" },
              { label: "Avg decision", value: "4h", delta: "was 2d" },
              { label: "Auto-synced", value: "100%" },
            ],
          },
        ],
      },
      {
        label: "Dashboard",
        title: "People dashboard",
        sub: "Colombo HQ · 128 employees",
        activeNav: 0,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "Present", value: "112", delta: "88%" },
              { label: "On leave", value: "9" },
              { label: "Pending", value: "7" },
              { label: "Late", value: "6" },
            ],
          },
          {
            type: "chart",
            title: "Attendance (last 8 weeks)",
            bars: [86, 89, 84, 90, 88, 92, 87, 91],
            statValue: "88%",
            statLabel: "avg attendance",
          },
          {
            type: "list",
            title: "By department",
            items: [
              { label: "Engineering", meta: "54 people · 3 on leave", value: "91%" },
              { label: "Support", meta: "38 people · 2 on leave", value: "86%" },
              { label: "Finance", meta: "22 people · 1 on leave", value: "90%" },
            ],
          },
        ],
      },
    ],
    mobile: [
      {
        label: "Home",
        title: "Hi, Dilani",
        sub: "Tue 1 Jul · Engineering",
        activeNav: 0,
        blocks: [
          {
            type: "stats",
            items: [
              { label: "Leave balance", value: "14 days" },
              { label: "Clocked in", value: "08:52" },
            ],
          },
          {
            type: "list",
            title: "My requests",
            items: [
              { label: "Annual leave · 14–18 Jul", meta: "LR-2048 · with HR", status: "Pending" },
              { label: "WFH · 20 Jun", meta: "LR-1994", status: "Approved" },
            ],
          },
          { type: "cta", cta: "Request leave" },
        ],
      },
      {
        label: "Request",
        title: "Request leave",
        sub: "Annual leave · replaces the paper form",
        activeNav: 1,
        blocks: [
          {
            type: "form",
            title: "New leave request",
            items: [
              { label: "Type", value: "Annual leave" },
              { label: "Dates", value: "14–18 Jul" },
              { label: "Days", value: "5" },
              { label: "Cover", value: "Sahan D." },
            ],
            cta: "Submit for approval",
          },
          { type: "note", text: "Routes straight to your manager, then HR. You'll see each step update here — no paper, no chasing." },
        ],
      },
      {
        label: "Status",
        title: "Request LR-2048",
        sub: "Annual leave · 14–18 Jul",
        activeNav: 1,
        blocks: [
          {
            type: "progress",
            title: "Approval status",
            pct: 66,
            sub: "Submitted 09:10 · manager approved 11:24",
            steps: [
              { label: "Submitted", done: true },
              { label: "Manager approved", done: true },
              { label: "HR confirmation", done: false },
              { label: "Added to calendar", done: false },
            ],
          },
          { type: "pills", pills: ["Balance 14d", "Cover set", "No clash"] },
          { type: "cta", cta: "Withdraw request" },
        ],
      },
    ],
  },
};
