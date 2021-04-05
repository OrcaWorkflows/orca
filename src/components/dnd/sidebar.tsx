import React from 'react';

const sidebar = () => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="sidebar">
            <table className={"sidebar-table"}>
                <tbody>
                    <tr>
                        <td>
                            <div className="s3" onDragStart={(event) => onDragStart(event, 'S3')}
                                 draggable/>
                        </td>
                        <td>
                            <span>AWS S3</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="kafka" onDragStart={(event) => onDragStart(event, 'Kafka')} draggable/>
                        </td>
                        <td>
                            <span>Kafka</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="elasticsearch" onDragStart={(event) => onDragStart(event, 'Elasticsearch')}
                                 draggable/>
                        </td>
                        <td>
                            <span>Elasticsearch</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
export default sidebar;