import * as React from 'react'
import { PureComponent, MouseEvent as RMouseEvent } from 'react'
import * as classnames from 'classnames'
import Popper from '../components/Popper'
import Select from './Select'
import Icon from './Icon'
import ImageOptions from './ImageOptions'
import SizeReduce from './SizeReduce'
import { ITaskItem, TaskStatus, IOptimizeOptions, SaveType } from '../../common/constants'
import * as _ from '../../common/utils'
import __ from '../../locales'

import './TaskView.less'

interface ITaskViewProps {
  task: ITaskItem
  onRemove(task: ITaskItem): void
  onClick(task: ITaskItem): void
  onSave(task: ITaskItem, type: SaveType): void
  onOptionsChange(task: ITaskItem, options: IOptimizeOptions): void
}

class TaskView extends PureComponent<ITaskViewProps, {}> {
  handleClear = (e: RMouseEvent<HTMLAnchorElement>) => {
    this.stopEvent(e)

    this.props.onRemove(this.props.task)
  }

  handleClick = (e: RMouseEvent<HTMLDivElement>) => {
    if (this.props.task.status === 'FAIL') return

    this.props.onClick(this.props.task)
  }

  handleOptionsChange = (options: IOptimizeOptions) => {
    this.props.onOptionsChange(this.props.task, options)
  }

  handleSave = (e: RMouseEvent<Element>, type: SaveType) => {
    this.stopEvent(e)

    this.props.onSave(this.props.task, type)
  }

  handleRefreah = (e: RMouseEvent<Element>) => {
    this.stopEvent(e)

    const { task } = this.props
    this.props.onOptionsChange(task, task.options)
  }

  stopEvent = (e: RMouseEvent<Element>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const { task, onOptionsChange } = this.props
    const { image, optimized, options } = task
    const destImage = task.optimized || task.image
    const isProcessing = task.status === TaskStatus.PROCESSING

    return (
      <div className={classnames('task-view', '-' + task.status)}>
        <div className="image-view" onClick={this.handleClick}>
          <img src={destImage.url} alt="task-cover"/>
          <div className="image-view-menu">
            <Popper
              hoverMode={true}
              popper={<div className="popper-body">{task.status}</div>}
            >
              <span className="traffic">
                <Icon
                  name={isProcessing ? 'color' : 'dot'}
                  className={classnames({
                    '-spin': isProcessing,
                  })}
                />
              </span>
            </Popper>

            {
              task.status === 'FAIL' ? (
                <a href="#" onClick={this.handleRefreah}>
                  <Icon name="refresh" />
                </a>
              ) : null
            }

            <Popper
              hoverMode={true}
              popper={(
                <div className="popper-menu">
                  <a
                    href="#"
                    onClick={e => this.handleSave(e, SaveType.OVER)}
                  >
                    {__('save')}
                  </a>
                  <a
                    href="#"
                    onClick={e => this.handleSave(e, SaveType.SAVE_AS)}
                  >
                    {__('save_as')}
                  </a>
                </div>
              )}>
              <a href="#" onClick={this.stopEvent}>
                <Icon name="down" />
              </a>
            </Popper>

            <span className="blank" />

            <a className="close" href="#" onClick={this.handleClear}>
              <Icon name="clear" />
            </a>
          </div>
        </div>
        <div className="image-profile">
          <ImageOptions
            ext={image.ext}
            options={options}
            precision={false}
            onChange={this.handleOptionsChange}
          />
          <div className="image-sizes">
            <SizeReduce task={task} />
          </div>
        </div>
      </div>
    )
  }
}

export default TaskView
