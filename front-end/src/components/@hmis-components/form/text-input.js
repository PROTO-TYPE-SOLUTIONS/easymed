import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {alpha} from "@mui/material";

export const RedditTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: '1px solid #e2e2e1',
        overflow: 'hidden',
        borderRadius: 4,
        fontSize:'14px',
        fontWeight: 'bold',
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:hover': {
            backgroundColor: `${alpha(theme.palette.common.white, 0.8)}`,
        },
        '&.Mui-focused': {
            backgroundColor: `${alpha(theme.palette.common.white, 0.8)}`,
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
            borderColor: theme.palette.primary.main,
        },
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));
const CustomTextInput = props => {
    const { ...other } = props;

    return(
        <>
            <RedditTextField variant="filled"  {...other}/>
        </>
    )
}

export default CustomTextInput;