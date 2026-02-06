import "../renterLayout.scss";

interface LocationTypeCardProps {
  typeName: string;
  typeDescription: string;
  typeLogo: string;
  typeBackGround: string;
}

export const LocationTypeCard = (props: LocationTypeCardProps) => {
  return (
    <div className="type__card">
      <img
        className="back-ground"
        src={props.typeBackGround}
        alt={props.typeName}
      />
      <div className="type__card-content">
        <div className="type__card-content-logo">
          <img src={props.typeLogo} alt={props.typeName} />
        </div>
        <div className="type__card-content-text">
          <h1 className="type__card-name">{props.typeName}</h1>
          <p className="type__card-description">{props.typeDescription}</p>
        </div>
      </div>
    </div>
  );
};
