import './UserIcon.scss';
export const UserIcon = () => {
    return (
        <div className="user-icon">
            <div className="image">
                <img src="https://picsum.photos/800/600?random=1" alt="#" />
            </div>
            <div className="info">
                <div className="info__header">
                    <span><strong>Name</strong></span>

                </div>
                <div className="info__content">
                    <span>content</span>
                    <span className="separator">•</span>
                    <span>time</span>
                </div>
            </div>
            <div className="status">

            </div>
        </div>
    )
}