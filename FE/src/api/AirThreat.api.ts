import {useQuery} from "@tanstack/react-query";
import {getAirThreatCommand} from "./AirThreat.commands.ts";

export class AirThreatApi {
    static useGetSafePlaces = () => {
        return useQuery({
            queryKey: ['safePlaces'],
            queryFn: () => getAirThreatCommand(),
        });
    };
};
