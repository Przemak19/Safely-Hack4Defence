import {useDropzone} from "react-dropzone";
import {Box, Button, Typography} from "@mui/material";
import {useSnackbar} from "../../hooks/useSnackbar.tsx";

const ImageDropzone = ({ uploadedFiles, setUploadedFiles }: { uploadedFiles: File[], setUploadedFiles: (files: File[]) => void }) => {
    const {showError, showSuccess} = useSnackbar();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 5,
        onDrop: (acceptedFiles: File[]) => {
            const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, 5);
            setUploadedFiles(newFiles);
            showSuccess(`Dodano pliki`);
        },
        onDropRejected: (_) => {
            showError('Niektóre pliki zostały odrzucone. Sprawdź format i liczbę plików.');
        }
    });

    const removeFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
    };

    return (
        <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Zdjęcia zdarzenia
            </Typography>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
                    '&:hover': {
                        backgroundColor: '#f0f0f0'
                    }
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Typography>Upuść pliki tutaj...</Typography>
                ) : (
                    <Typography>
                        Przeciągnij zdjęcia tutaj lub kliknij, aby wybrać pliki (max 5)
                    </Typography>
                )}
            </Box>
            {uploadedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Wybrane pliki ({uploadedFiles.length}/5):
                    </Typography>
                    {uploadedFiles.map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1,
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                mb: 1
                            }}
                        >
                            <Typography variant="body2">
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                            <Button
                                size="small"
                                color="error"
                                onClick={() => removeFile(index)}
                            >
                                Usuń
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageDropzone;