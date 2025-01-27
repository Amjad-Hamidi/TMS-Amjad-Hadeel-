import React from 'react';
import { UserRole } from '../types/auth';

interface Props {
    value: UserRole;
    onChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<Props> = ({ value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as UserRole)}
            className="p-2 border rounded-md"
        >
            <option value="user">User</option>
            <option value="administrator">Administrator</option>
            <option value="company">Company</option>
            <option value="guest">Guest</option>
        </select>
    );
};

export default RoleSelector;
