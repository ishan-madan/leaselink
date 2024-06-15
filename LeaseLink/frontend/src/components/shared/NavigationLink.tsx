import { Link } from "react-router-dom";

// define type for nav bar buttons
type Props = {
    to: string;
    bg: string;
    text: string;
    textColor: string;
    onClick?:() => Promise<void>;
}

const NavigationLink = (props:Props) => {
    return <Link className="nav-link" to={props.to} style={{background:props.bg, color:props.textColor}}>
        {props.text}
        </Link>;
}

export default NavigationLink