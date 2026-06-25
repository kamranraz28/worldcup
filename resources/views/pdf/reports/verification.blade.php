<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 20px; }
        body { font-family: 'Inter', 'DejaVu Sans', sans-serif; background: #0F172A; color: #E2E8F0; padding: 20px; }
        h1 { font-size: 22px; color: #F8FAFC; margin: 0 0 4px 0; }
        .subtitle { color: #E30613; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
        .header { border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; }
        .header .meta { text-align: right; font-size: 10px; color: #64748B; }
        .summary-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .summary-card { flex: 1; min-width: 100px; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); }
        .summary-card .label { font-size: 9px; text-transform: uppercase; color: #64748B; letter-spacing: 1px; }
        .summary-card .value { font-size: 18px; font-weight: 700; color: #F1F5F9; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 12px; }
        th { background: rgba(227,6,19,0.1); color: #E30613; padding: 8px 10px; text-align: left; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 8px; border-bottom: 1px solid rgba(227,6,19,0.2); }
        td { padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); color: #CBD5E1; }
        tr:nth-child(even) td { background: rgba(255,255,255,0.01); }
        .footer { text-align: center; font-size: 9px; color: #475569; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; margin-top: 16px; }
        .status { display:inline-block; padding:2px 8px; border-radius:10px; font-size:8px; font-weight:600; }
        .status-verified { background:rgba(22,163,74,0.15); color:#22C55E; }
        .status-rejected { background:rgba(239,68,68,0.15); color:#F87171; }
        .status-pending { background:rgba(251,191,36,0.15); color:#FBBF24; }
        .status-in_review { background:rgba(59,130,246,0.15); color:#60A5FA; }
        .status-flagged { background:rgba(168,85,247,0.15); color:#C084FC; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="subtitle">Toffee — FIFA World Cup 2026</div>
            <h1>Verification Report</h1>
        </div>
        <div class="meta">
            <p>Generated: {{ $generatedAt->format('M d, Y g:i A') }}</p>
            <p>{{ count($report['verifications'] ?? []) }} records</p>
        </div>
    </div>

    <div class="summary-grid">
        <div class="summary-card"><div class="label">Total</div><div class="value">{{ $report['summary']['total_verifications'] ?? 0 }}</div></div>
        <div class="summary-card"><div class="label">Verified</div><div class="value" style="color:#22C55E">{{ $report['summary']['verified'] ?? 0 }}</div></div>
        <div class="summary-card"><div class="label">Rejected</div><div class="value" style="color:#F87171">{{ $report['summary']['rejected'] ?? 0 }}</div></div>
        <div class="summary-card"><div class="label">Pending</div><div class="value" style="color:#FBBF24">{{ $report['summary']['pending'] ?? 0 }}</div></div>
        <div class="summary-card"><div class="label">In Review</div><div class="value" style="color:#60A5FA">{{ $report['summary']['in_review'] ?? 0 }}</div></div>
        <div class="summary-card"><div class="label">Avg Review</div><div class="value">{{ $report['summary']['avg_review_time_hours'] ?? 0 }}h</div></div>
    </div>

    <h2 style="font-size:14px;color:#94A3B8;margin:12px 0 8px 0;">By Reviewer</h2>
    <table>
        <tr><th>Reviewer</th><th>Total</th><th>Approved</th><th>Rejected</th></tr>
        @foreach(($report['by_reviewer'] ?? []) as $row)
        <tr><td>{{ $row['name'] }}</td><td>{{ $row['count'] }}</td><td style="color:#22C55E">{{ $row['approved'] }}</td><td style="color:#F87171">{{ $row['rejected'] }}</td></tr>
        @endforeach
    </table>

    <h2 style="font-size:14px;color:#94A3B8;margin:16px 0 8px 0;">All Verifications</h2>
    <table>
        <tr><th>Customer</th><th>Email</th><th>Type</th><th>Status</th><th>Reviewer</th><th>Submitted</th><th>Reviewed</th></tr>
        @foreach(($report['verifications'] ?? []) as $v)
        <tr>
            <td>{{ $v['customer']['first_name'] ?? '' }} {{ $v['customer']['last_name'] ?? '' }}</td>
            <td>{{ $v['customer']['email'] ?? '' }}</td>
            <td>{{ str_replace('_', ' ', $v['verification_type'] ?? '') }}</td>
            <td><span class="status status-{{ $v['status'] }}">{{ str_replace('_', ' ', $v['status'] ?? '') }}</span></td>
            <td>{{ $v['reviewer'] ?? '' }}</td>
            <td>{{ $v['submitted_at'] ? \Carbon\Carbon::parse($v['submitted_at'])->format('M d, Y') : '' }}</td>
            <td>{{ $v['reviewed_at'] ? \Carbon\Carbon::parse($v['reviewed_at'])->format('M d, Y') : '' }}</td>
        </tr>
        @endforeach
    </table>

    <div class="footer">
        <p style="color:#E30613;font-weight:700;font-size:11px;">TOFFEE — Official Partner FIFA World Cup 2026</p>
    </div>
</body>
</html>
