<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkImportRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('create', \App\Models\Ticket::class) : false;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'import_file' => ['required', 'file', 'mimes:csv,txt,xlsx,xls', 'max:10240'],
            'status' => ['nullable', Rule::in(['reserved', 'confirmed', 'pending_approval'])],
        ];
    }

    public function messages(): array
    {
        return [
            'import_file.max' => 'Import file must not exceed 10MB.',
            'import_file.mimes' => 'File must be CSV or Excel format.',
        ];
    }
}
