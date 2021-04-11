import React, {Component} from "react";

interface NodeProps {
    node: string
}

class NodeRow extends Component<NodeProps> {
    render() {
        const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
            event.dataTransfer.setData('application/reactflow', nodeType);
            event.dataTransfer.effectAllowed = 'move';
        };

        return (
            <tr>
                <td>
                    <div className={this.props.node.toLowerCase()}
                         onDragStart={(event) => onDragStart(event, this.props.node)}
                         draggable/>
                </td>
                <td>
                    <span>{this.props.node}</span>
                </td>
            </tr>
        );
    }
}

export default NodeRow;