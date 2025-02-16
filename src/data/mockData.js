"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_INVENTORY = exports.HOSPITALS = void 0;
exports.HOSPITALS = [
    {
        id: 'stanford-hospital',
        name: 'Stanford Hospital',
        location: 'Palo Alto, CA'
    },
    {
        id: 'ucsf-medical',
        name: 'UCSF Medical Center',
        location: 'San Francisco, CA'
    },
    {
        id: 'mayo-clinic',
        name: 'Mayo Clinic',
        location: 'Rochester, MN'
    }
];
exports.INITIAL_INVENTORY = {
    'stanford-hospital': [
        { name: 'Aspirin', quantity: 1000 },
        { name: 'Ibuprofen', quantity: 750 },
        { name: 'Amoxicillin', quantity: 500 },
        { name: 'Lipitor', quantity: 300 },
        { name: 'Insulin', quantity: 200 }
    ],
    'ucsf-medical': [
        { name: 'Morphine', quantity: 100 },
        { name: 'Epinephrine', quantity: 250 },
        { name: 'Penicillin', quantity: 800 },
        { name: 'Metformin', quantity: 600 }
    ],
    'mayo-clinic': [
        { name: 'Oxycodone', quantity: 150 },
        { name: 'Prozac', quantity: 400 },
        { name: 'Zoloft', quantity: 350 },
        { name: 'Adderall', quantity: 200 }
    ]
};
