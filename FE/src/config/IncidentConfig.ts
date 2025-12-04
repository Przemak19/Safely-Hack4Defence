export type IncidentType = 'fire' | 'flood' | 'air_threat' | 'harmful_incident' | 'cyber_threat';

export interface IncidentConfig {
    title: string;
    buttonLabel: string;
    steps: string[];
    color: string;
    type: IncidentType;
    iconType: 'fire' | 'water' | 'health' | 'warning';
}

export const INCIDENTS: Record<IncidentType, IncidentConfig> = {
    fire: {
        title: "ALARM POŻAROWY",
        buttonLabel: "Zgłoś Pożar",
        type: "fire",
        steps: [
            "Zachowaj spokój i nie wpadaj w panikę.",
            "Udaj się do najbliższego wyjścia ewakuacyjnego.",
            "Nie używaj wind.",
            "Poruszaj się nisko przy podłodze (unikaj dymu)."
        ],
        color: "#d32f2f",
        iconType: "fire"
    },
    flood: {
        title: "AWARIA HYDRAULICZNA",
        buttonLabel: "Zgłoś Zalanie",
        type: "flood",
        steps: [
            "Zakręć główny zawór wody, jeśli to możliwe.",
            "Zabezpiecz sprzęt elektroniczny i dokumenty.",
            "Powiadom służby techniczne budynku."
        ],
        color: "#0288d1",
        iconType: "water"
    },
    harmful_incident: {
        title: "ATAK Z OSTRYM NARZĘDZIEM",
        buttonLabel: "Wezwij Pomoc",
        type: "harmful_incident",
        steps: [
            "Nie konfrontuj się z napastnikiem.",
            "Oddal się w bezpieczne miejsce.",
            "Natychmiast wezwij policję."
        ],
        color: "#d32f2f",
        iconType: "warning"
    },
    air_threat: {
        title: "ZAGROŻENIE POWIETRZNE",
        buttonLabel: "Powiadom Służby",
        type: "air_threat",
        steps: [
            "Opuszczaj teren zagrożenia.",
            "Unikaj kontaktu z niebezpiecznymi przedmiotami.",
            "Powiadom odpowiednie służby ratunkowe."
        ],
        color: "#ed6c02",
        iconType: "warning"
    },
    cyber_threat: {
        title: "INCYDENT CYBERBEZPIECZEŃSTWA",
        buttonLabel: "Zgłoś Incydent",
        type: "cyber_threat",
        steps: [
            "Odłącz urządzenia od sieci.",
            "Nie otwieraj podejrzanych plików ani linków.",
            "Powiadom dział IT lub administratora systemu."
        ],
        color: "#0288d1",
        iconType: "warning"
    }
};