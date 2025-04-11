import {BaseObject} from "@/models/base-object";

export class GameService {
    // Static variables
    static readonly MONEY_AMOUNT: number = 0;

    static readonly GAME_OBJECTS: BaseObject[] = [];

    static readonly GAME_BUFF = [
        {
            id: 1,
            title: "Nouvelle demande",
            imageUrl: "https://pixijs.com/assets/bunny.png", // image provisoire
            tooltip: "Un client demande un nouveau projet"
        },
        {
            id: 2,
            title: "Problème technique",
            imageUrl: "https://pixijs.com/assets/bunny.png",
            tooltip: "Un serveur est tombé en panne"
        },
        {
            id: 3,
            title: "Réunion d'équipe",
            imageUrl: "https://pixijs.com/assets/bunny.png",
            tooltip: "Réunion importante à 14h"
        }
    ];

    // Add methods or additional logic as needed
}
