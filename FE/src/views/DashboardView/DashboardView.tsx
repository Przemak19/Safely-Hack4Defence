
import { useForm } from 'react-hook-form';
import {
    CardContent,
    TextField,
    Typography,
    Container,
    TextareaAutosize,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button,
} from '@mui/material';
import { useSnackbar } from '../../hooks/useSnackbar.tsx';
import { joiResolver } from '@hookform/resolvers/joi';
import {DashboardViewStyles} from "./DashboardView.styles.ts";
import {type EventFormData, eventSchema} from "../../validation/eventValidation.ts";
import {useState} from "react";
import {SharedStyles} from "../../shared/styles/FormRow.styles.ts";
import Map from "../../components/Map.tsx";
import {geocodingCoordinatesToAddress, geocodingAddressToCoordinates, createEvent, photoUpload} from "../../api/api.commands.ts";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import {useNavigate} from "react-router-dom";
import {EventCategoryEnum} from "../../shared/enums/EventCategory.enum.ts";
import type {IncidentType} from "../../config/IncidentConfig.ts";
import ImageDropzone from "../../shared/components/ImageDropzone.tsx";

interface MapClickEvent {
    latitude: number;
    longitude: number;
}

const DashboardView = () => {
    const { showSuccess, showError } = useSnackbar();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([52.237049, 21.017532]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const navigate = useNavigate();
    const {CardWrapper, CreateEventButton, CustomCard} = DashboardViewStyles;
    const {FormRow} = SharedStyles;

    const eventCategoryToIncidentType: Record<EventCategoryEnum, IncidentType> = {
        [EventCategoryEnum.FIRE]: 'fire',
        [EventCategoryEnum.FLOOD]: 'flood',
        [EventCategoryEnum.HARMFUL_INCIDENT]: 'harmful_incident',
        [EventCategoryEnum.AIR_THREAT]: 'air_threat',
        [EventCategoryEnum.CYBER_THREAT]: 'cyber_threat',
    };


    const mapGeoResponseToAddress = async () => {
        const { coordinates } = eventForm.getValues();
        const latitude = parseFloat(coordinates?.latitude || '0');
        const longitude = parseFloat(coordinates?.longitude || '0');
        try {
            const res = await geocodingCoordinatesToAddress({latitude, longitude});
            setValue('streetName', `${res.road} ${res.house_number || ''}` || '');
            setValue('city', res.city || res.town || '');
            setValue('state', res.state || '');
            showSuccess('Adres został pobrany');
        } catch (error) {
            showError('Błąd podczas pobierania adresu');
        }
    }

    const handleGetUserCoordinates = () => {
        if (!navigator.geolocation) {
            showError('Geolokalizacja nie jest wspierana przez Twoją przeglądarkę');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setValue('coordinates.latitude', latitude.toString());
                setValue('coordinates.longitude', longitude.toString());
                setMarkerPosition([latitude, longitude]);
                setMapCenter([latitude, longitude]);
                showSuccess('Pobrano Twoją lokalizację');
            },
            (error) => {
                showError('Nie udało się pobrać lokalizacji');
                console.error(error);
            },
            { enableHighAccuracy: true }
        );
    };


    const getCoordinatesFromAddress = async () => {
        const { streetName, city, state } = eventForm.getValues();

        if(!streetName || !city || !state) {
            showError('Wpisz ulicę, miasto oraz województwo');
            return;
        }

        try {
            const result = await geocodingAddressToCoordinates({
                streetName,
                city,
                state,
                country: 'Poland'
            });

            setValue('coordinates.latitude', result.lat);
            setValue('coordinates.longitude', result.lon);
            setMarkerPosition([parseFloat(result.lat), parseFloat(result.lon)]);
            setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
            showSuccess('Pobrano Twoją lokalizację');
        } catch (error) {
            showError('Nie znaleziono współrzędnych dla podanego adresu');
        }
    }

    const onEventSubmit = async (data: EventFormData) => {
        setIsLoading(true);
        try {
            const eventResponse = await createEvent(data);
            const incidentId = eventResponse;

            if (uploadedFiles.length > 0) {
                const photoUploadPromises = uploadedFiles.map((file) =>
                    photoUpload(file, incidentId)
                );
                await Promise.all(photoUploadPromises);
            }
            
            const incidentType = eventCategoryToIncidentType[data.eventCategory];
            navigate(`/incident-guidance?type=${incidentType}`);
            showSuccess('Zgłoszenie zostało wysłane');
        } catch(error) {
            showError("Wystąpił błąd podczas wysyłania zgłoszenia");
        } finally {
            setIsLoading(false);
        }
    };

    const eventForm = useForm<EventFormData>({
        resolver: joiResolver(eventSchema),
        mode: 'onChange'
    });

    const {
        register: registerEvent,
        handleSubmit: handleEventSubmit,
        formState: { errors: eventErrors },
        setValue,
    } = eventForm;

    const handleMapClick =  async ({ latitude, longitude }: MapClickEvent) => {
        try {
            setValue('coordinates.longitude', longitude.toString());
            setValue('coordinates.latitude', latitude.toString());
            setMarkerPosition([latitude, longitude]);
        } catch (error) {
            showError('Błąd');
        }
    }

    return (
        <Container maxWidth="xl">
            <CardWrapper>
                <CustomCard>
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            align="center"
                            color="primary"
                        >
                           Zgłoś incydent
                        </Typography>

                            <form onSubmit={handleEventSubmit(onEventSubmit)}>
                                <FormRow>
                                    <TextField
                                        {...registerEvent('firstName')}
                                        fullWidth
                                        label="Imię"
                                        margin="normal"
                                        error={!!eventErrors.firstName}
                                        helperText={eventErrors.firstName?.message}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                    <TextField
                                        {...registerEvent('lastName')}
                                        fullWidth
                                        label="Nazwisko"
                                        margin="normal"
                                        error={!!eventErrors.lastName}
                                        helperText={eventErrors.lastName?.message}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </FormRow>
                                <FormRow>
                                    <TextField
                                        {...registerEvent('phoneNumber')}
                                        fullWidth
                                        label="Numer telefonu"
                                        margin="normal"
                                        error={!!eventErrors.phoneNumber}
                                        helperText={eventErrors.phoneNumber?.message}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                    <TextField
                                        {...registerEvent('streetName')}
                                        fullWidth
                                        label="Ulica"
                                        margin="normal"
                                        error={!!eventErrors.streetName}
                                        helperText={eventErrors.streetName?.message}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </FormRow>
                                <FormRow>
                                    <TextField
                                        {...registerEvent('city')}
                                        fullWidth
                                        label="Miasto"
                                        margin="normal"
                                        error={!!eventErrors.city}
                                        helperText={eventErrors.city?.message}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                    <TextField
                                        {...registerEvent('state')}
                                        fullWidth
                                        label="Województwo"
                                        margin="normal"
                                        error={!!eventErrors.state}
                                        helperText={eventErrors.state?.message}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                    />
                                </FormRow>
                                <FormRow>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Kategoria zdarzenia</InputLabel>
                                        <Select
                                            {...registerEvent('eventCategory')}
                                            label="Kategoria zdarzenia"
                                            error={!!eventErrors.eventCategory}
                                            defaultValue=""
                                        >
                                            <MenuItem value={1}>Pożar</MenuItem>
                                            <MenuItem value={2}>Powódź</MenuItem>
                                            <MenuItem value={3}>Niebezpieczny incydent</MenuItem>
                                            <MenuItem value={4}>Zagrożenie powietrzne</MenuItem>
                                            <MenuItem value={5}>Cyberzagrożenie</MenuItem>
                                        </Select>
                                        {eventErrors.eventCategory && (
                                            <Typography variant="caption" color="error">
                                                {eventErrors.eventCategory.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </FormRow>
                                <FormRow>
                                    <TextareaAutosize
                                        {...registerEvent('eventDescription')}
                                        minRows={5}
                                        placeholder="Opis zdarzenia"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderColor: eventErrors.eventDescription ? 'red' : '#ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            resize: 'vertical',
                                        }}
                                    />
                                </FormRow>
                                <FormRow>
                                    <ImageDropzone 
                                        uploadedFiles={uploadedFiles}
                                        setUploadedFiles={setUploadedFiles}
                                    />
                                </FormRow>
                                <FormRow sx={{p: 4}}>
                                    <Button variant='contained' fullWidth onClick={mapGeoResponseToAddress}>
                                        Weź adres z punktu na mapie
                                    </Button>
                                    <Button variant='contained' fullWidth onClick={getCoordinatesFromAddress}>
                                        Weź punkt na mapie z adresu
                                    </Button>
                                    <Button variant='contained' onClick={handleGetUserCoordinates}>
                                        <GpsFixedIcon sx={{ color: "#ffffffff", fontSize: 20, margin: 'auto' }} />
                                    </Button>
                                </FormRow>
                                <Map height="400px" onMapClick={handleMapClick} markerPosition={markerPosition} center={mapCenter}/>
                                <CreateEventButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    loading={isLoading}
                                >
                                    Wyślij zgłoszenie
                                </CreateEventButton>
                            </form>

                    </CardContent>
                </CustomCard>
            </CardWrapper>
        </Container>
    );
};

export default DashboardView;
