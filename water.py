from flask import Flask, jsonify, request
from flask_cors import CORS
import plotly.graph_objects as go
import plotly.io as pio
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/plot')
def plot():
    fig = go.Figure()

    tanks = ['Fresh Water', 'WHO\'s Upper Limit', 'Palestine\'s Water', 'Sea Water']
    salt_content = [100, 200, 3000, 3500]
    tank_spacing = 1.5  
    tank_width = 2    
    margin = tank_spacing

    for i, (tank, salt) in enumerate(zip(tanks, salt_content)):
        x0 = margin + i * (tank_width + tank_spacing)
        x1 = x0 + tank_width
        tank_height = 4000

        fig.add_shape(type='line', x0=x0, y0=0, x1=x0, y1=tank_height, line=dict(color='black', width=2))
        fig.add_shape(type='line', x1=x1, y0=0, x0=x1, y1=tank_height, line=dict(color='black', width=2))
        fig.add_shape(type='line', x0=x0, y0=0, x1=x1, y1=0, line=dict(color='black', width=2))

        x_wave = np.linspace(x0, x1, 100)
        y_wave = (tank_height - 100) + 70 * np.sin(6 * np.pi * (x_wave - x0) / (x1 - x0))
        x_fill = np.concatenate([x_wave, [x1, x0]])
        y_fill = np.concatenate([y_wave, [0, 0]])

        fig.add_trace(go.Scatter(x=x_fill, y=y_fill, mode='lines', line=dict(color='lightblue'), fill='toself', fillcolor='lightblue', showlegend=False, hoverinfo='none'))

        y_positions = np.linspace(0, salt, salt)
        x_positions = np.random.uniform(x0, x1, salt)
        fig.add_trace(go.Scatter(x=x_positions, y=y_positions, mode='markers',
                                 marker=dict(color='white', size=2.5), showlegend=False,
                                 hoverinfo='none'))

        fig.add_trace(go.Scatter(
            x=np.random.uniform(x0, x1, 500),
            y=np.random.uniform(0, tank_height, 500),
            mode='markers',
            marker=dict(size=0.1, color='rgba(0,0,0,0)'),
            hoverinfo='text',
            text=[f'{tank}: In 1 litre of water there are {salt} mg salt'] * 500,
            showlegend=False
        ))

    fig.update_layout(
        title='Water Tanks with Salt Content',
        xaxis=dict(
            title='Types of water', 
            tickvals=[margin + i * (tank_width + tank_spacing) + tank_width / 2 for i in range(len(tanks))], 
            ticktext=tanks,
            showline=True,  
            linecolor='black',  
            linewidth=2 
        ),
        yaxis=dict(
            title='Salt Content (mg/L)', 
            tickvals=list(range(0, 4000, 500)), 
            range=[0, 4000],
            showline=True,  
            linecolor='black',
            linewidth=2 
        ),
        showlegend=False,
        plot_bgcolor='white',
        hoverlabel=dict(bgcolor="white")  
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

@app.route('/water_tank_plot')
def water_tank_plot():
    modes = {
        "Before War": 88,
        "After War": 3
    }

    tank_spacing = 1.5  
    tank_width = 2    
    margin = 0  
    tank_height = 100  

    total_duration = 3000  
    frames_count = 10

    fig = go.Figure()

    def add_tank_and_water(fig, water_level, x0, x1, tank_height, tank_width, show_label=False):
        fig.add_shape(type='line', x0=x0, y0=0, x1=x0, y1=tank_height, line=dict(color='black', width=2))
        fig.add_shape(type='line', x0=x1, y0=0, x1=x1, y1=tank_height, line=dict(color='black', width=2))
        fig.add_shape(type='line', x0=x0, y0=0, x1=x1, y1=0, line=dict(color='black', width=2))

        y_fill = [0, (tank_height / 100) * water_level, (tank_height / 100) * water_level, 0]
        x_fill = [x0, x0, x1, x1]

        fig.add_trace(go.Scatter(
            x=x_fill, 
            y=y_fill, 
            mode='lines', 
            line=dict(color='lightblue'), 
            fill='toself', 
            fillcolor='lightblue', 
            showlegend=False, 
            hoverinfo='text',
            text=[f'Water Level: {water_level} L']*4
        ))

        fig.add_trace(go.Scatter(
            x=np.random.uniform(x0, x1, 500),
            y=np.random.uniform(0, tank_height, 500),
            mode='markers',
            marker=dict(size=0.1, color='rgba(0,0,0,0)'),
            hoverinfo='text',
            text=[f'Water Level: {water_level} L'] * 500,
            showlegend=False
        ))

        if show_label:
            fig.add_annotation(
                x=x0 + tank_width / 2,
                y=(tank_height / 100) * water_level,
                text=f"{water_level} L",
                showarrow=False
            )

    x0 = margin
    x1 = x0 + tank_width

    add_tank_and_water(fig, modes["Before War"], x0, x1, tank_height, tank_width, show_label=False)

    fig.update_layout(
        title='Water Tank in Gaza Before and After War',
        xaxis=dict(
            title='Water Availability in Gaza per Person per Day',
            showline=False,  
            showticklabels=False,
            range=[x0, x1 + 0.1]
        ),
        yaxis=dict(
            title='Water Level (L)',
            tickvals=list(range(0, tank_height + 1, 10)),
            ticktext=[str(int(i * (100 / tank_height))) for i in range(0, tank_height + 1, 10)],
            range=[0, tank_height],
            showline=True,  
            linecolor='black',
            linewidth=2,
        ),
        showlegend=False,
        plot_bgcolor='white',
        hoverlabel=dict(bgcolor="white"),
        updatemenus=[{
            "buttons": [
                {
                    "label": "Gaza After War",
                    "method": "animate",
                    "args": [
                        [f'frame_{level:.1f}' for level in np.linspace(modes["Before War"], modes["After War"], num=frames_count)],
                        {"frame": {"duration": total_duration / frames_count, "redraw": True}, "mode": "immediate"}
                    ]
                },
                {
                    "label": "Gaza Before War",
                    "method": "animate",
                    "args": [
                        [f'frame_{level:.1f}' for level in np.linspace(modes["After War"], modes["Before War"], num=frames_count)],
                        {"frame": {"duration": total_duration / frames_count, "redraw": True}, "mode": "immediate"}
                    ]
                }
            ],
            "direction": "left",
            "pad": {"r": 10, "t": 87},
            "showactive": True,
            "type": "buttons",
            "x": 0.5,
            "xanchor": "center",
            "y": 1.1,
            "yanchor": "top"
        }]
    )

    frames = []

    water_levels = np.linspace(modes["Before War"], modes["After War"], num=frames_count)
    for level in water_levels:
        frames.append(
            go.Frame(
                data=[
                    go.Scatter(
                        x=[x0, x0, x1, x1],
                        y=[0, (tank_height / 100) * level, (tank_height / 100) * level, 0],
                        mode='lines', line=dict(color='lightblue'), fill='toself', fillcolor='lightblue', showlegend=False, hoverinfo='text',
                        text=[f'Water Level: {level:.1f} L']*4
                    ),
                    go.Scatter(
                        x=np.random.uniform(x0, x1, 500),
                        y=np.random.uniform(0, tank_height, 500),
                        mode='markers',
                        marker=dict(size=0.1, color='rgba(0,0,0,0)'),
                        hoverinfo='text',
                        text=[f'Water Level: {level:.1f} L'] * 500,
                        showlegend=False
                    )
                ],
                name=f'frame_{level:.1f}'
            )
        )

    water_levels_reverse = np.linspace(modes["After War"], modes["Before War"], num=frames_count)
    for level in water_levels_reverse:
        frames.append(
            go.Frame(
                data=[
                    go.Scatter(
                        x=[x0, x0, x1, x1],
                        y=[0, (tank_height / 100) * level, (tank_height / 100) * level, 0],
                        mode='lines', line=dict(color='lightblue'), fill='toself', fillcolor='lightblue', showlegend=False, hoverinfo='text',
                        text=[f'Water Level: {level:.1f} L']*4
                    ),
                    go.Scatter(
                        x=np.random.uniform(x0, x1, 500),
                        y=np.random.uniform(0, tank_height, 500),
                        mode='markers',
                        marker=dict(size=0.1, color='rgba(0,0,0,0)'),
                        hoverinfo='text',
                        text=[f'Water Level: {level:.1f} L'] * 500,
                        showlegend=False
                    )
                ],
                name=f'frame_{level:.1f}'
            )
        )

    fig.frames = frames

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

@app.route('/water_availability_gaza_plot')
def water_availability_gaza_plot():
    data = [88, 3, 7.5]
    labels = ['Gaza before War', 'Gaza after War', "WHO's emergency minimum"]

    hover_text = [
        'Gaza before War: 88L Daily Water Availability per Capita',
        'Gaza after War: 3L Daily Water Availability per Capita',
        "WHO's emergency minimum: 7.5L Daily Water Availability per Capita"
    ]

    initial_shapes = []
    for idx, label in enumerate(labels):
        initial_shapes.extend([
            dict(type="line", x0=idx - 0.4, x1=idx + 0.4, y0=0, y1=0, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx - 0.4, x1=idx - 0.4, y0=0, y1=100, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx + 0.4, x1=idx + 0.4, y0=0, y1=100, line=dict(color="gray", width=2))
        ])

        initial_shapes.extend([
            dict(type="rect", x0=idx - 0.1, x1=idx + 0.1, y0=100, y1=105, fillcolor="gray", line=dict(color="gray", width=2)),
            dict(type="rect", x0=idx - 0.2, x1=idx + 0.2, y0=105, y1=107, fillcolor="gray", line=dict(color="gray", width=2))
        ])

    second_faucet_center_x = 1
    width_rect = 0.03
    second_faucet_shape = dict(type="rect", x0=second_faucet_center_x - width_rect / 2, x1=second_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    third_faucet_center_x = 2
    width_rect = 0.05
    third_faucet_shape = dict(type="rect", x0=third_faucet_center_x - width_rect / 2, x1=third_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    first_faucet_center_x = 0
    width_rect = 0.1
    first_faucet_shape = dict(type="rect", x0=first_faucet_center_x - width_rect / 2, x1=first_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    frames = []
    num_frames = 50

    for i in range(num_frames + 1):
        current_heights = [val * (i / num_frames) for val in data]

        if i == 0:
            second_faucet_shape['y1'] = 100

        if i == 0:
            third_faucet_shape['y1'] = 100

        if i == 0:
            first_faucet_shape['y1'] = 100

        if i == num_frames:
            first_faucet_shape['y1'] = 0
            second_faucet_shape['y1'] = 0
            third_faucet_shape['y1'] = 0

        frame = go.Frame(
            data=[go.Bar(x=labels, y=current_heights, marker_color='lightblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
            name=str(i),
            layout=go.Layout(
                title="Water Availability in Gaza Before and After War and WHO's Emergency Minimum",
                xaxis_title="Situation",
                yaxis_title="Liters per Capita per Day",
                xaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
                yaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
                template="plotly_white",
                barmode='overlay',
                shapes=initial_shapes + [third_faucet_shape] + [first_faucet_shape] + [second_faucet_shape]
            )
        )
        frames.append(frame)

    fig = go.Figure(
        data=[go.Bar(x=labels, y=[0, 0, 0], marker_color='lightblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
        layout=go.Layout(
            title="Water Availability in Gaza Before and After War and WHO's Emergency Minimum",
            xaxis_title="Situation",
            yaxis_title="Liters per Capita per Day",
            xaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
            yaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
            template="plotly_white",
            barmode='overlay',
            shapes=initial_shapes
        ),
        frames=frames
    )

    fig.update_traces(hoverlabel=dict(bgcolor="white"))

    fig.update_layout(
        updatemenus=[
            {
                "buttons": [
                    {
                        "args": [None, {"frame": {"duration": 50, "redraw": True}, "fromcurrent": True}],
                        "label": "Play",
                        "method": "animate"
                    },
                    {
                        "args": [[None], {"frame": {"duration": 0, "redraw": True}, "mode": "immediate", "transition": {"duration": 0}}],
                        "label": "Pause",
                        "method": "animate"
                    }
                ],
                "direction": "left",
                "pad": {"r": 10, "t": 87},
                "showactive": False,
                "type": "buttons",
                "x": 0.1,
                "xanchor": "right",
                "y": 0,
                "yanchor": "top"
            }
        ]
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

@app.route('/water_availability_world_plot')
def water_availability_world_plot():
    data = [812, 75.7, 100, 535.7, 1383.8, 1197.1, 1239.6, 2399.4, 2172.7]
    labels = ['Israel', 'Palestine', "WHO's minimum", 'Africa', 'Oceania', 'Europe', 'North America', 'South America', 'Asia']

    hover_text = [
        'Israel: 812L Daily Water Availability per Capita',
        'Palestine: 75.7L Daily Water Availability per Capita',
        "WHO's minimum: 100L Daily Water Availability per Capita",
        'Africa: 535.7L Daily Water Availability per Capita',
        'Oceania: 1383.8L Daily Water Availability per Capita',
        'Europe: 1197.1L Daily Water Availability per Capita',
        'North America: 1239.6L Daily Water Availability per Capita',
        'South America: 2399.4L Daily Water Availability per Capita',
        'Asia: 2172.7L Daily Water Availability per Capita'
    ]

    initial_shapes = []
    for idx, label in enumerate(labels):
        initial_shapes.extend([
            dict(type="line", x0=idx - 0.4, x1=idx + 0.4, y0=0, y1=0, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx - 0.4, x1=idx - 0.4, y0=0, y1=2500, line=dict(color="gray", width=2)),
            dict(type="line", x0=idx + 0.4, x1=idx + 0.4, y0=0, y1=2500, line=dict(color="gray", width=2))
        ])

        initial_shapes.extend([
            dict(type="rect", x0=idx - 0.1, x1=idx + 0.1, y0=2500, y1=2550, fillcolor="gray", line=dict(color="gray", width=2)),
            dict(type="rect", x0=idx - 0.2, x1=idx + 0.2, y0=2550, y1=2570, fillcolor="gray", line=dict(color="gray", width=2))
        ])

    second_faucet_center_x = 1
    width_rect = 0.03
    second_faucet_shape = dict(type="rect", x0=second_faucet_center_x - width_rect / 2, x1=second_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    third_faucet_center_x = 2
    width_rect = 0.5
    third_faucet_shape = dict(type="rect", x0=third_faucet_center_x - width_rect / 2, x1=third_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    first_faucet_center_x = 0
    width_rect = 0.2
    first_faucet_shape = dict(type="rect", x0=first_faucet_center_x - width_rect / 2, x1=first_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    fourth_faucet_center_x = 3
    width_rect = 0.15
    fourth_faucet_shape = dict(type="rect", x0=fourth_faucet_center_x - width_rect / 2, x1=fourth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    fifth_faucet_center_x = 4
    width_rect = 0.15
    fifth_faucet_shape = dict(type="rect", x0=fifth_faucet_center_x - width_rect / 2, x1=fifth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    sixth_faucet_center_x = 5
    width_rect = 0.15
    sixth_faucet_shape = dict(type="rect", x0=sixth_faucet_center_x - width_rect / 2, x1=sixth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    seventh_faucet_center_x = 6
    width_rect = 0.15
    seventh_faucet_shape = dict(type="rect", x0=seventh_faucet_center_x - width_rect / 2, x1=seventh_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    eighth_faucet_center_x = 7
    width_rect = 0.15
    eighth_faucet_shape = dict(type="rect", x0=eighth_faucet_center_x - width_rect / 2, x1=eighth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    ninth_faucet_center_x = 8
    width_rect = 0.15
    ninth_faucet_shape = dict(type="rect", x0=ninth_faucet_center_x - width_rect / 2, x1=ninth_faucet_center_x + width_rect / 2, y0=0, y1=0, fillcolor="lightblue", line=dict(color="lightblue", width=0))

    frames = []
    num_frames = 50

    for i in range(num_frames + 1):
        current_heights = [val * (i / num_frames) for val in data]

        if i == 0:
            second_faucet_shape['y1'] = 2500

        if i == 0:
            third_faucet_shape['y1'] = 2500

        if i == 0:
            first_faucet_shape['y1'] = 2500

        if i == 0:
            fourth_faucet_shape['y1'] = 2500

        if i == 0:
            fifth_faucet_shape['y1'] = 2500

        if i == 0:
            sixth_faucet_shape['y1'] = 2500

        if i == 0:
            seventh_faucet_shape['y1'] = 2500

        if i == 0:
            eighth_faucet_shape['y1'] = 2500

        if i == 0:
            ninth_faucet_shape['y1'] = 2500

        if i == num_frames:
            first_faucet_shape['y1'] = 0
            second_faucet_shape['y1'] = 0
            third_faucet_shape['y1'] = 0
            fourth_faucet_shape['y1'] = 0
            fifth_faucet_shape['y1'] = 0
            sixth_faucet_shape['y1'] = 0
            seventh_faucet_shape['y1'] = 0
            eighth_faucet_shape['y1'] = 0
            ninth_faucet_shape['y1'] = 0

        frame = go.Frame(
            data=[go.Bar(x=labels, y=current_heights, marker_color='lightblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
            name=str(i),
            layout=go.Layout(
                title="Water Availability in Different Regions",
                xaxis_title="Regions",
                yaxis_title="Liters per Capita per Day",
                xaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
                yaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
                template="plotly_white",
                barmode='overlay',
                shapes=initial_shapes + [third_faucet_shape] + [first_faucet_shape] + [second_faucet_shape] + [fourth_faucet_shape]+ [fifth_faucet_shape]+ [sixth_faucet_shape]+ [seventh_faucet_shape]+ [eighth_faucet_shape]+ [ninth_faucet_shape]
            )
        )
        frames.append(frame)

    fig = go.Figure(
        data=[go.Bar(x=labels, y=[0] * len(labels), marker_color='lightblue', width=0.8, hovertext=hover_text, hoverinfo='text')],
        layout=go.Layout(
            title="Water Availability in Different Regions",
            xaxis_title="Regions",
            yaxis_title="Liters per Capita per Day",
            xaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
            yaxis=dict(showline=True, linewidth=2, linecolor='black', showticklabels=True, tickfont=dict(size=12), ticks="outside", tickwidth=2, tickcolor='black'),
            template="plotly_white",
            barmode='overlay',
            shapes=initial_shapes
        ),
        frames=frames
    )

    fig.update_traces(hoverlabel=dict(bgcolor="white"))

    fig.update_layout(
        updatemenus=[
            {
                "buttons": [
                    {
                        "args": [None, {"frame": {"duration": 50, "redraw": True}, "fromcurrent": True}],
                        "label": "Play",
                        "method": "animate"
                    },
                    {
                        "args": [[None], {"frame": {"duration": 0, "redraw": True}, "mode": "immediate", "transition": {"duration": 0}}],
                        "label": "Pause",
                        "method": "animate"
                    }
                ],
                "direction": "left",
                "pad": {"r": 10, "t": 87},
                "showactive": False,
                "type": "buttons",
                "x": 0.1,
                "xanchor": "right",
                "y": 0,
                "yanchor": "top"
            }
        ]
    )

    fig_json = pio.to_json(fig)
    return jsonify(fig_json)

if __name__ == '__main__':
    app.run(debug=True)
