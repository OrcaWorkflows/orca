import React, { memo, FC, CSSProperties } from 'react';

import { Handle, Position, NodeProps, Connection, Edge } from 'react-flow-renderer';

const targetHandleStyle: CSSProperties = { background: '#555' };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle};

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);

const ELASTICSEARCH: FC<NodeProps> = ({ data }) => {
    return (
        <>
            <Handle className={"operator-handle"} type="target" position={Position.Top} id="operator_target" style={targetHandleStyle} onConnect={onConnect} />
            <div className="elasticsearch"/>
            <Handle className={"operator-handle"}  type="source" position={Position.Bottom} id="operator_source" style={sourceHandleStyleA} />
        </>
);
};

export default memo(ELASTICSEARCH);