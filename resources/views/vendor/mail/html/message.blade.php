<x-mail::layout>
{{-- Header --}}
<x-slot:header>
<x-mail::header :url="config('app.url')">
@if (file_exists(public_path('ticketclub.png')))
    @php($ticketLogo = base64_encode(file_get_contents(public_path('ticketclub.png'))))
    <img src="data:image/png;base64,{{ $ticketLogo }}" alt="TicketClub"
        style="display:inline-block;height:42px;width:auto;max-width:220px;border:0;outline:none;text-decoration:none;vertical-align:middle;" />
@else
    {{ config('app.name') }}
@endif
</x-mail::header>
</x-slot:header>

{{-- Body --}}
{!! $slot !!}

{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset

{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
© {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}<br>
Powered by [Synergy Interface Ltd.](https://synergyinterface.com/web/)
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
