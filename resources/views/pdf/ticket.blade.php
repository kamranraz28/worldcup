<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 0; padding: 0; }
        body {
            font-family: 'Inter', 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
            background: #0F172A;
            color: #E2E8F0;
        }
        .ticket-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .ticket-header {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, rgba(227,6,19,0.1) 0%, rgba(15,23,42,1) 100%);
            border-radius: 16px 16px 0 0;
            border: 1px solid rgba(255,255,255,0.1);
            border-bottom: none;
        }
        .ticket-header h1 {
            font-size: 28px;
            font-weight: 800;
            color: #F8FAFC;
            margin: 0 0 5px 0;
        }
        .ticket-header .subtitle {
            font-size: 14px;
            color: #E30613;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .ticket-body {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-top: none;
            border-bottom: none;
            padding: 30px;
        }
        .ticket-details {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 30px;
        }
        .detail-block {
            flex: 1;
            min-width: 200px;
        }
        .detail-block .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748B;
            margin-bottom: 4px;
        }
        .detail-block .value {
            font-size: 16px;
            font-weight: 600;
            color: #F1F5F9;
        }
        .qr-section {
            text-align: center;
            padding: 30px 0;
            border-top: 2px dashed rgba(255,255,255,0.1);
            border-bottom: 2px dashed rgba(255,255,255,0.1);
            margin: 30px 0;
        }
        .qr-section table {
            margin: 0 auto;
        }
        .qr-code-text {
            font-size: 12px;
            color: #64748B;
            margin-top: 10px;
            font-family: monospace;
            letter-spacing: 1px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .info-row .label { font-size: 13px; color: #64748B; }
        .info-row .value { font-size: 13px; color: #E2E8F0; font-weight: 500; }
        .ticket-footer {
            text-align: center;
            padding: 20px 30px;
            background: linear-gradient(135deg, rgba(227,6,19,0.05) 0%, rgba(15,23,42,1) 100%);
            border: 1px solid rgba(255,255,255,0.1);
            border-top: none;
            border-radius: 0 0 16px 16px;
        }
        .ticket-footer p {
            font-size: 12px;
            color: #475569;
            margin: 2px 0;
        }
        .ticket-footer .brand {
            color: #E30613;
            font-weight: 700;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(22,163,74,0.15);
            color: #22C55E;
            border: 1px solid rgba(22,163,74,0.3);
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-header">
            <div class="subtitle">Toffee — FIFA World Cup 2026</div>
            <h1>{{ $ticket->event->title ?? 'Event Ticket' }}</h1>
            <span class="status-badge">{{ ucfirst($ticket->status) }}</span>
        </div>

        <div class="ticket-body">
            <div class="ticket-details">
                <div class="detail-block">
                    <div class="label">Customer</div>
                    <div class="value">{{ $ticket->customer->first_name ?? '' }} {{ $ticket->customer->last_name ?? '' }}</div>
                </div>
                <div class="detail-block">
                    <div class="label">Ticket Type</div>
                    <div class="value">{{ ucfirst($ticket->ticket_type) }}</div>
                </div>
                <div class="detail-block">
                    <div class="label">Price</div>
                    <div class="value">{{ $ticket->currency ?? 'BDT' }} {{ number_format($ticket->price, 2) }}</div>
                </div>
            </div>

            <div class="info-row">
                <span class="label">Event Date</span>
                <span class="value">{{ $ticket->event->start_date ? $ticket->event->start_date->format('l, F j, Y') : 'TBD' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Time</span>
                <span class="value">{{ $ticket->event->start_date ? $ticket->event->start_date->format('g:i A') : 'TBD' }} — {{ $ticket->event->end_date ? $ticket->event->end_date->format('g:i A') : 'TBD' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Venue</span>
                <span class="value">{{ $ticket->event->venue_name ?? 'To Be Announced' }}</span>
            </div>
            @if($ticket->event->venue_address)
            <div class="info-row">
                <span class="label">Address</span>
                <span class="value">{{ $ticket->event->venue_address }}</span>
            </div>
            @endif
            @if($ticket->session)
            <div class="info-row">
                <span class="label">Session</span>
                <span class="value">{{ $ticket->session->title }} @if($ticket->session->location) — {{ $ticket->session->location }} @endif</span>
            </div>
            @endif

            <div class="qr-section">
                {!! $qrTable !!}
                <div class="qr-code-text">{{ $ticket->qr_code }}</div>
            </div>

            <div class="info-row">
                <span class="label">Customer Email</span>
                <span class="value">{{ $ticket->customer->email ?? 'N/A' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Customer Phone</span>
                <span class="value">{{ $ticket->customer->phone ?? 'N/A' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Registered On</span>
                <span class="value">{{ $ticket->registered_at ? $ticket->registered_at->format('M d, Y g:i A') : 'N/A' }}</span>
            </div>
            @if($ticket->approved_at)
            <div class="info-row">
                <span class="label">Approved On</span>
                <span class="value">{{ $ticket->approved_at->format('M d, Y g:i A') }}</span>
            </div>
            @endif
        </div>

        <div class="ticket-footer">
            <p class="brand">⚽ TOFFEE</p>
            <p>Official Partner — FIFA World Cup 2026</p>
            <p>This is your official e-ticket. Present the QR code at the venue for entry.</p>
        </div>
    </div>
</body>
</html>
