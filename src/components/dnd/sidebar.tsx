import React from 'react';
const sidebar = () => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            <div className="description">Operators</div>

            <div className="s3" onDragStart={(event) => onDragStart(event, 'S3')} draggable>
                AWS S3
            </div>
            <div className="kafka" onDragStart={(event) => onDragStart(event, 'Kafka')} draggable>
                Kafka
            </div>
            <div className="elasticsearch" onDragStart={(event) => onDragStart(event, 'Elasticsearch')} draggable>
                Elasticsearch
            </div>
        </aside>
    );
};
export default sidebar;