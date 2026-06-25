<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('create', \App\Models\Ticket::class) : false;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'event_session_id' => ['nullable', 'integer', 'exists:event_sessions,id'],
            'ticket_type' => ['required', Rule::in(['general', 'vip', 'vvip', 'comp', 'staff'])],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', Rule::in(['reserved', 'confirmed', 'pending_approval'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
