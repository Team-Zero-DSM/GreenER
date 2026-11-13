
import { useState, type FormEvent } from 'react';

import type { UserProfile } from '@/types/profile';

interface ProfileInformationFormProps {
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
    onBack: () => void;
}

const inputClassName =
    'h-11 w-full rounded-lg border border-input bg-background/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/15';

export function ProfileInformationForm({
    profile,
    onSave,
    onBack,
}: ProfileInformationFormProps) {
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const updatedProfile = {
            ...profile,
            name: name.trim(),
            email: email.trim(),
        };

        if (!updatedProfile.name || !updatedProfile.email) return;

        onSave(updatedProfile);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
                <h3 className="text-base font-semibold">
                    Informações pessoais
                </h3>

                <p className="text-sm text-muted-foreground">
                    Atualize seu nome e endereço de e-mail.
                </p>
            </div>

            <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium">
                    Nome
                </label>

                <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Digite seu nome"
                    autoComplete="name"
                    className={inputClassName}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-medium">
                    E-mail
                </label>

                <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    className={inputClassName}
                    required
                />
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-border/70 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                    Voltar
                </button>

                <button
                    type="submit"
                    className="min-h-11 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
                >
                    Salvar alterações
                </button>
            </div>
        </form>
    );
}
