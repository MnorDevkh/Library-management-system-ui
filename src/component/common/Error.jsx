import { Alert, Space } from 'antd';
import { useState } from 'react';


function ErrorSignUp() {
    const  setIsShowErr= useState(false);

    const onClose = () => {
        setIsShowErr(false);
    };


    return (<div>
        <Space
            direction="vertical"
            style={{
                width: '100%',
            }}
        >
            <Alert
                message="Error Sign-Up"
                description="Email already Created"
                type="error"
                closable
                onClose={onClose}
            />
            
        </Space></div>
    );
}

export default ErrorSignUp;