// Imports
// -------

// Types
import { InferProps } from 'prop-types'

// Internal
// --------

// https://medium.com/javascript-inside/notes-on-typescript-inferring-react-proptypes-dfb93100523d
type InferPropTypes<
  PropTypes,
  DefaultProps = Record<string, never>,
  Props = InferProps<PropTypes>,
> = {
  [Key in keyof Props]: Key extends keyof DefaultProps
    ? Props[Key] | DefaultProps[Key]
    : Props[Key]
}

// Exports
// -------

// Named
export { InferPropTypes }
