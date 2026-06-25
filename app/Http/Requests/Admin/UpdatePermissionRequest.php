<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('roles.edit') ?? false;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission');

        return [
            'name' => ['required', 'string', 'max:100', "unique:permissions,name,{$permissionId}", 'regex:/^[a-z]+\.[a-z\-]+$/'],
            'display_name' => ['required', 'string', 'max:100'],
            'group' => ['required', 'string', 'max:50'],
        ];
    }
}
