import { Alert, Space } from 'antd';
import React, { useState } from 'react';

const WarningPopUpComponents = () => {
    const [isShowErr, setIsShowErr] = useState(false);

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
                message="Error Signing In"
                description="Incorrect Username or Password"
                type="error"
                closable
                onClose={onClose}
            />
        </Space></div>
    );
}

export default WarningPopUpComponents;